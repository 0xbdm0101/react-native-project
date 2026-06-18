import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Device, Service, Characteristic } from "react-native-ble-plx";
import { Buffer } from "buffer";

interface DeviceDetailProps {
  device: Device;
  onDisconnect: () => void;
}

// 标准 BLE UUID
const STANDARD_UUIDS: Record<string, string> = {
  '181A': '环境传感服务',
  '2A6E': '温度',
  '2A6F': '湿度',
  '2A00': '设备名称',
  '2A01': '外观',
  '2A04': '连接参数',
};

export function DeviceDetail({ device, onDisconnect }: DeviceDetailProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [characteristics, setCharacteristics] = useState<Map<string, Characteristic[]>>(new Map());
  const [sensorData, setSensorData] = useState<{ temperature?: number; humidity?: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 发现服务和特征值
  useEffect(() => {
    discoverServices();
  }, []);

  const discoverServices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 发现所有服务
      const discoveredServices = await device.services();
      setServices(discoveredServices);

      // 发现每个服务的特征值
      const charsMap = new Map<string, Characteristic[]>();
      for (const service of discoveredServices) {
        const chars = await device.characteristicsForService(service.uuid);
        charsMap.set(service.uuid, chars);
      }
      setCharacteristics(charsMap);

      // 自动读取温湿度数据
      await readSensorData(charsMap);
    } catch (err: any) {
      console.error('发现服务失败:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 读取传感器数据
  const readSensorData = async (charsMap: Map<string, Characteristic[]>) => {
    try {
      for (const [serviceUuid, chars] of charsMap) {
        for (const char of chars) {
          if (char.uuid === '2A6E') {
            // 读取温度
            const tempChar = await char.read();
            const tempValue = parseTemperature(tempChar.value);
            setSensorData(prev => ({ ...prev, temperature: tempValue }));
            console.log('🌡️ 温度:', tempValue);
          } else if (char.uuid === '2A6F') {
            // 读取湿度
            const humChar = await char.read();
            const humValue = parseHumidity(humChar.value);
            setSensorData(prev => ({ ...prev, humidity: humValue }));
            console.log('💧 湿度:', humValue);
          }
        }
      }
    } catch (err: any) {
      console.error('读取数据失败:', err);
    }
  };

  // 解析温度数据 (IEEE 11073)
  const parseTemperature = (base64Value: string | null): number => {
    if (!base64Value) return 0;
    const buffer = Buffer.from(base64Value, 'base64');
    const value = buffer.readInt16LE(0);
    return value / 100;
  };

  // 解析湿度数据 (IEEE 11073)
  const parseHumidity = (base64Value: string | null): number => {
    if (!base64Value) return 0;
    const buffer = Buffer.from(base64Value, 'base64');
    const value = buffer.readUInt16LE(0);
    return value / 100;
  };

  // 订阅温度更新
  const subscribeTemperature = useCallback(() => {
    for (const [serviceUuid, chars] of characteristics) {
      for (const char of chars) {
        if (char.uuid === '2A6E') {
          char.monitor((error, characteristic) => {
            if (error) {
              console.error('订阅温度失败:', error);
              return;
            }
            if (characteristic?.value) {
              const temp = parseTemperature(characteristic.value);
              setSensorData(prev => ({ ...prev, temperature: temp }));
            }
          });
        }
      }
    }
  }, [characteristics]);

  // 订阅湿度更新
  const subscribeHumidity = useCallback(() => {
    for (const [serviceUuid, chars] of characteristics) {
      for (const char of chars) {
        if (char.uuid === '2A6F') {
          char.monitor((error, characteristic) => {
            if (error) {
              console.error('订阅湿度失败:', error);
              return;
            }
            if (characteristic?.value) {
              const hum = parseHumidity(characteristic.value);
              setSensorData(prev => ({ ...prev, humidity: hum }));
            }
          });
        }
      }
    }
  }, [characteristics]);

  // 获取 UUID 显示名称
  const getUUIDName = (uuid: string): string => {
    const upperUUID = uuid.toUpperCase();
    return STANDARD_UUIDS[upperUUID] || `自定义 (${uuid.substring(0, 8)}...)`;
  };

  // 渲染传感器数据卡片
  const renderSensorCard = () => {
    if (!sensorData.temperature && !sensorData.humidity) return null;

    return (
      <View style={styles.sensorCard}>
        <Text style={styles.cardTitle}>📊 实时数据</Text>

        {sensorData.temperature !== undefined && (
          <View style={styles.dataRow}>
            <Ionicons name="thermometer" size={24} color="#FF6B6B" />
            <View style={styles.dataInfo}>
              <Text style={styles.dataLabel}>温度</Text>
              <Text style={styles.dataValue}>{sensorData.temperature.toFixed(1)}°C</Text>
            </View>
          </View>
        )}

        {sensorData.humidity !== undefined && (
          <View style={styles.dataRow}>
            <Ionicons name="water" size={24} color="#4FC3F7" />
            <View style={styles.dataInfo}>
              <Text style={styles.dataLabel}>湿度</Text>
              <Text style={styles.dataValue}>{sensorData.humidity.toFixed(1)}%</Text>
            </View>
          </View>
        )}

        <View style={styles.buttonRow}>
          <Pressable style={styles.subscribeBtn} onPress={subscribeTemperature}>
            <Text style={styles.subscribeBtnText}>订阅温度更新</Text>
          </Pressable>
          <Pressable style={styles.subscribeBtn} onPress={subscribeHumidity}>
            <Text style={styles.subscribeBtnText}>订阅湿度更新</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  // 渲染服务列表
  const renderServices = () => {
    return services.map((service) => (
      <View key={service.uuid} style={styles.serviceItem}>
        <View style={styles.serviceHeader}>
          <Ionicons name="cube" size={20} color="#4FC3F7" />
          <Text style={styles.serviceUUID}>{getUUIDName(service.uuid)}</Text>
        </View>
        <Text style={styles.serviceUUIDFull}>{service.uuid}</Text>

        {/* 特征值列表 */}
        {characteristics.get(service.uuid)?.map((char) => (
          <View key={char.uuid} style={styles.charItem}>
            <View style={styles.charHeader}>
              <Ionicons name="settings" size={16} color="#888" />
              <Text style={styles.charUUID}>{getUUIDName(char.uuid)}</Text>
            </View>
            <Text style={styles.charUUIDFull}>{char.uuid}</Text>
            <View style={styles.charProperties}>
              {char.isReadable && <Text style={styles.propertyBadge}>可读</Text>}
              {char.isWritableWithResponse && <Text style={styles.propertyBadge}>可写</Text>}
              {char.isNotifiable && <Text style={styles.propertyBadge}>可通知</Text>}
            </View>
          </View>
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {device.name || '未知设备'}
        </Text>
        <Pressable onPress={onDisconnect} style={styles.disconnectBtn}>
          <Text style={styles.disconnectText}>断开</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {/* 设备信息 */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>📱 设备信息</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>名称</Text>
            <Text style={styles.infoValue}>{device.name || '未知'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID</Text>
            <Text style={styles.infoValue}>{device.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>信号强度</Text>
            <Text style={styles.infoValue}>{device.rssi} dBm</Text>
          </View>
        </View>

        {/* 传感器数据 */}
        {renderSensorCard()}

        {/* 服务列表 */}
        <View style={styles.servicesCard}>
          <Text style={styles.cardTitle}>🔍 发现的服务和特征值</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4FC3F7" />
              <Text style={styles.loadingText}>正在发现服务...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={40} color="#F44336" />
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryBtn} onPress={discoverServices}>
                <Text style={styles.retryBtnText}>重试</Text>
              </Pressable>
            </View>
          ) : (
            renderServices()
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backBtn: { padding: 8 },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  disconnectBtn: {
    backgroundColor: 'rgba(244,67,54,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  disconnectText: {
    color: '#F44336',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#888',
    fontSize: 14,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  sensorCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dataInfo: {
    marginLeft: 12,
  },
  dataLabel: {
    color: '#888',
    fontSize: 12,
  },
  dataValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  subscribeBtn: {
    flex: 1,
    backgroundColor: 'rgba(79,195,247,0.2)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeBtnText: {
    color: '#4FC3F7',
    fontSize: 13,
    fontWeight: '500',
  },
  servicesCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  serviceItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceUUID: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  serviceUUIDFull: {
    color: '#666',
    fontSize: 11,
    marginLeft: 28,
    marginBottom: 8,
  },
  charItem: {
    marginLeft: 28,
    marginBottom: 8,
  },
  charHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  charUUID: {
    color: '#888',
    fontSize: 13,
    marginLeft: 6,
  },
  charUUIDFull: {
    color: '#555',
    fontSize: 10,
    marginLeft: 24,
    marginTop: 2,
  },
  charProperties: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 24,
    marginTop: 4,
  },
  propertyBadge: {
    backgroundColor: 'rgba(79,195,247,0.15)',
    color: '#4FC3F7',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    color: '#888',
    fontSize: 14,
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: 'rgba(79,195,247,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  retryBtnText: {
    color: '#4FC3F7',
    fontSize: 14,
  },
});
