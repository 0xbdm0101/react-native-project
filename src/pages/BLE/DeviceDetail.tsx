import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PageHeader } from "@/components/PageHeader";
import { Device, Service, Characteristic } from "react-native-ble-plx";
import { Buffer } from "buffer";

interface DeviceDetailProps {
  device: Device;
  onDisconnect: () => void;
  onBack?: () => void;
}

// 标准 BLE UUID
const STANDARD_UUIDS: Record<string, string> = {
  '180A': '设备信息服务',
  '180F': '电池服务',
  '181A': '环境传感服务',
  '2A6E': '温度',
  '2A6F': '湿度',
  '2A00': '设备名称',
  '2A01': '外观',
  '2A04': '连接参数',
  '2A19': '电池电量',
  '2A29': '制造商名称',
  '2A24': '型号',
  '2A25': '序列号',
  '2A26': '固件版本',
  '2A27': '硬件版本',
  '2A28': '软件版本',
};

export function DeviceDetail({ device, onDisconnect, onBack }: DeviceDetailProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [characteristics, setCharacteristics] = useState<Map<string, Characteristic[]>>(new Map());
  const [sensorData, setSensorData] = useState<{ temperature?: number; humidity?: number; battery?: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRSSI, setCurrentRSSI] = useState<number | null>(device.rssi);

  // 发现服务和特征值
  useEffect(() => {
    discoverServices();

    // 立即读取一次 RSSI
    readCurrentRSSI();

    // 保持连接活跃（每 10 秒读取一次 RSSI）
    const keepAliveInterval = setInterval(async () => {
      try {
        const updatedDevice = await device.readRSSI();
        if (updatedDevice.rssi !== null) {
          setCurrentRSSI(updatedDevice.rssi);
        }
      } catch (err) {
        console.log("保持连接失败:", err);
      }
    }, 10000);

    // 监听设备断开事件（比如盖上盖子）
    const subscription = device.onDisconnected((error, disconnectedDevice) => {
      console.log("设备断开，自动返回列表");
      // 设备已断开，只需要返回列表，不需要再次断开
      if (onBack) {
        onBack();
      }
    });

    return () => {
      subscription.remove();
      clearInterval(keepAliveInterval);
    };
  }, []);

  // 立即读取 RSSI
  const readCurrentRSSI = async () => {
    try {
      console.log("开始读取 RSSI...");
      console.log("设备初始 RSSI:", device.rssi);

      // 1. 先使用扫描时的 RSSI（这个一定有）
      if (device.rssi !== null && device.rssi !== undefined) {
        setCurrentRSSI(device.rssi);
        console.log("✅ 使用扫描时的 RSSI:", device.rssi);
      }

      // 2. 尝试读取最新 RSSI（可能失败）
      try {
        const updatedDevice = await device.readRSSI();
        if (updatedDevice.rssi !== null) {
          setCurrentRSSI(updatedDevice.rssi);
          console.log("✅ RSSI 更新成功:", updatedDevice.rssi);
        }
      } catch (readErr) {
        console.log("⚠️ readRSSI 不支持，保持使用扫描值");
        // 不支持就不更新，保持扫描时的值
      }
    } catch (err) {
      console.log("❌ RSSI 处理失败:", err);
    }
  };

  const discoverServices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 发现所有服务
      const discoveredServices = await device.services();
      setServices(discoveredServices);
      console.log('📋 发现服务数量:', discoveredServices.length);

      // 发现每个服务的特征值
      const charsMap = new Map<string, Characteristic[]>();
      for (const service of discoveredServices) {
        const chars = await device.characteristicsForService(service.uuid);
        charsMap.set(service.uuid, chars);
        console.log(`📦 服务 ${getUUIDName(service.uuid)} (${service.uuid}):`);
        chars.forEach(char => {
          const properties = [];
          if (char.isReadable) properties.push('可读');
          if (char.isWritableWithResponse) properties.push('可写');
          if (char.isNotifiable) properties.push('可通知');
          console.log(`  - ${getUUIDName(char.uuid)} (${char.uuid}) [${properties.join(', ')}]`);
        });
      }
      setCharacteristics(charsMap);

      // 自动读取传感器数据
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
      // 只读取我们关心的特征值，不读取所有可读特征值
      const targetUUIDs = ['2A6E', '2A6F', '2A19']; // 温度、湿度、电池

      for (const [serviceUuid, chars] of charsMap) {
        for (const char of chars) {
          if (targetUUIDs.includes(char.uuid)) {
            try {
              const value = await char.read();

              if (char.uuid === '2A6E') {
                // 读取温度
                const tempValue = parseTemperature(value.value);
                setSensorData(prev => ({ ...prev, temperature: tempValue }));
                console.log('🌡️ 温度:', tempValue);
              } else if (char.uuid === '2A6F') {
                // 读取湿度
                const humValue = parseHumidity(value.value);
                setSensorData(prev => ({ ...prev, humidity: humValue }));
                console.log('💧 湿度:', humValue);
              } else if (char.uuid === '2A19') {
                // 读取电池电量
                const batteryValue = parseBattery(value.value);
                setSensorData(prev => ({ ...prev, battery: batteryValue }));
                console.log('🔋 电池:', batteryValue);
              }
            } catch (readErr) {
              console.log(`⚠️ 读取 ${getUUIDName(char.uuid)} 失败:`, readErr);
              // 单个读取失败不影响其他读取
            }
          }
          // 不读取其他特征值，避免导致设备断开
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

  // 解析电池电量 (0-100%)
  const parseBattery = (base64Value: string | null): number => {
    if (!base64Value) return 0;
    const buffer = Buffer.from(base64Value, 'base64');
    return buffer.readUInt8(0);
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
    const hasData = sensorData.temperature !== undefined ||
                    sensorData.humidity !== undefined ||
                    sensorData.battery !== undefined;

    if (!hasData) return null;

    return (
      <View style={styles.sensorCard}>
        <Text style={styles.cardTitle}>📊 实时数据</Text>

        {sensorData.battery !== undefined && (
          <View style={styles.dataRow}>
            <Ionicons name="battery-full" size={24} color="#4CAF50" />
            <View style={styles.dataInfo}>
              <Text style={styles.dataLabel}>电池电量</Text>
              <Text style={styles.dataValue}>{sensorData.battery}%</Text>
            </View>
          </View>
        )}

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
          {sensorData.temperature !== undefined && (
            <Pressable style={styles.subscribeBtn} onPress={subscribeTemperature}>
              <Text style={styles.subscribeBtnText}>订阅温度</Text>
            </Pressable>
          )}
          {sensorData.humidity !== undefined && (
            <Pressable style={styles.subscribeBtn} onPress={subscribeHumidity}>
              <Text style={styles.subscribeBtnText}>订阅湿度</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  // 读取特征值
  const handleReadCharacteristic = async (char: Characteristic) => {
    try {
      const value = await char.read();
      console.log(`📖 读取 ${getUUIDName(char.uuid)}:`, value.value);

      // 解析数据
      const parsedValue = parseCharacteristicValue(value.value, char.uuid);
      console.log(`📊 解析结果:`, parsedValue);

      // 显示提示（这里可以添加 Toast 或 Modal）
      alert(`${getUUIDName(char.uuid)}: ${parsedValue}`);
    } catch (err) {
      console.log(`❌ 读取失败:`, err);
      alert(`读取失败: ${err}`);
    }
  };

  // 解析特征值
  const parseCharacteristicValue = (base64Value: string | null, uuid: string): string => {
    if (!base64Value) return '空值';

    try {
      const buffer = Buffer.from(base64Value, 'base64');

      // 根据 UUID 解析
      switch (uuid) {
        case '2A19': // 电池
          return `${buffer.readUInt8(0)}%`;
        case '2A6E': // 温度
          return `${(buffer.readInt16LE(0) / 100).toFixed(1)}°C`;
        case '2A6F': // 湿度
          return `${(buffer.readUInt16LE(0) / 100).toFixed(1)}%`;
        default:
          // 尝试解析为字符串
          try {
            return buffer.toString();
          } catch {
            // 返回十六进制
            return `0x${buffer.toString().toUpperCase()}`;
          }
      }
    } catch (err) {
      return `解析失败: ${err}`;
    }
  };

  // 渲染服务列表
  const renderServices = () => {
    if (services.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="information-circle" size={40} color="#666" />
          <Text style={styles.emptyText}>未发现服务</Text>
          <Text style={styles.emptySubtext}>设备可能不支持标准 BLE 服务</Text>
        </View>
      );
    }

    return services.map((service) => (
      <View key={service.uuid} style={styles.serviceItem}>
        <View style={styles.serviceHeader}>
          <Ionicons name="cube" size={20} color="#4FC3F7" />
          <Text style={styles.serviceUUID}>{getUUIDName(service.uuid)}</Text>
        </View>
        <Text style={styles.serviceUUIDFull}>{service.uuid}</Text>

        {/* 特征值列表 */}
        {characteristics.get(service.uuid)?.length === 0 ? (
          <Text style={styles.noCharsText}>无特征值</Text>
        ) : (
          characteristics.get(service.uuid)?.map((char) => (
            <View key={char.uuid} style={styles.charItem}>
              <View style={styles.charHeader}>
                <Ionicons name="settings" size={16} color="#888" />
                <Text style={styles.charUUID}>{getUUIDName(char.uuid)}</Text>
              </View>
              <Text style={styles.charUUIDFull}>{char.uuid}</Text>

              {/* 属性标签 */}
              <View style={styles.charProperties}>
                {char.isReadable && (
                  <View style={[styles.propertyBadge, styles.readableBadge]}>
                    <Ionicons name="eye" size={10} color="#4CAF50" />
                    <Text style={styles.readableText}>可读</Text>
                  </View>
                )}
                {char.isWritableWithResponse && (
                  <View style={[styles.propertyBadge, styles.writableBadge]}>
                    <Ionicons name="create" size={10} color="#FF9800" />
                    <Text style={styles.writableText}>可写</Text>
                  </View>
                )}
                {char.isWritableWithoutResponse && (
                  <View style={[styles.propertyBadge, styles.writableBadge]}>
                    <Ionicons name="create" size={10} color="#FF9800" />
                    <Text style={styles.writableText}>可写(无响应)</Text>
                  </View>
                )}
                {char.isNotifiable && (
                  <View style={[styles.propertyBadge, styles.notifiableBadge]}>
                    <Ionicons name="notifications" size={10} color="#2196F3" />
                    <Text style={styles.notifiableText}>可通知</Text>
                  </View>
                )}
                {char.isIndicatable && (
                  <View style={[styles.propertyBadge, styles.notifiableBadge]}>
                    <Ionicons name="notifications" size={10} color="#2196F3" />
                    <Text style={styles.notifiableText}>可指示</Text>
                  </View>
                )}
              </View>

              {/* 操作按钮 */}
              {char.isReadable && (
                <Pressable
                  style={styles.readBtn}
                  onPress={() => handleReadCharacteristic(char)}
                >
                  <Ionicons name="download" size={14} color="#4FC3F7" />
                  <Text style={styles.readBtnText}>读取</Text>
                </Pressable>
              )}
            </View>
          ))
        )}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <PageHeader
        title={device.name || '未知设备'}
        right={
          <Pressable onPress={onDisconnect} style={styles.disconnectBtn}>
            <Text style={styles.disconnectText}>断开</Text>
          </Pressable>
        }
        titleCentered
        onBack={onBack}
      />

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
            <Text style={styles.infoValue}>{currentRSSI ? `${currentRSSI} dBm` : '读取中...'}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 3,
  },
  readableBadge: {
    backgroundColor: 'rgba(76,175,80,0.15)',
  },
  readableText: {
    color: '#4CAF50',
    fontSize: 10,
  },
  writableBadge: {
    backgroundColor: 'rgba(255,152,0,0.15)',
  },
  writableText: {
    color: '#FF9800',
    fontSize: 10,
  },
  notifiableBadge: {
    backgroundColor: 'rgba(33,150,243,0.15)',
  },
  notifiableText: {
    color: '#2196F3',
    fontSize: 10,
  },
  readBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79,195,247,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    gap: 4,
  },
  readBtnText: {
    color: '#4FC3F7',
    fontSize: 12,
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 10,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
  },
  noCharsText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 28,
    marginTop: 4,
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
