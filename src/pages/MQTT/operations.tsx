import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMQTT } from "./hooks/useMQTT";
import { QoS } from "./constants";

// ==================== 设备配置 ====================

/** 设备控制项配置 */
interface DeviceControl {
  id: string;
  name: string;
  icon: string;
  topic: string;
  payloadOn: string;
  payloadOff: string;
  description: string;
}

/** 默认设备列表 */
const DEVICE_CONTROLS: DeviceControl[] = [
  {
    id: "light",
    name: "客厅灯",
    icon: "bulb-outline",
    topic: "home/livingroom/light",
    payloadOn: '{"state": "ON"}',
    payloadOff: '{"state": "OFF"}',
    description: "控制客厅主灯",
  },
  {
    id: "fan",
    name: "风扇",
    icon: "fan-outline",
    topic: "home/livingroom/fan",
    payloadOn: '{"state": "ON", "speed": 3}',
    payloadOff: '{"state": "OFF"}',
    description: "控制客厅风扇",
  },
  {
    id: "ac",
    name: "空调",
    icon: "snow-outline",
    topic: "home/bedroom/ac",
    payloadOn: '{"state": "ON", "temp": 26, "mode": "cool"}',
    payloadOff: '{"state": "OFF"}',
    description: "控制卧室空调",
  },
  {
    id: "curtain",
    name: "窗帘",
    icon: "menu-outline",
    topic: "home/livingroom/curtain",
    payloadOn: '{"state": "OPEN"}',
    payloadOff: '{"state": "CLOSE"}',
    description: "控制客厅窗帘",
  },
  {
    id: "tv",
    name: "电视",
    icon: "tv-outline",
    topic: "home/livingroom/tv",
    payloadOn: '{"state": "ON", "channel": 1}',
    payloadOff: '{"state": "OFF"}',
    description: "控制客厅电视",
  },
  {
    id: "speaker",
    name: "音响",
    icon: "volume-high-outline",
    topic: "home/livingroom/speaker",
    payloadOn: '{"state": "ON", "volume": 50}',
    payloadOff: '{"state": "OFF"}',
    description: "控制客厅音响",
  },
];

// ==================== 主页面 ====================

export default function MQTTOperationsPage() {
  const router = useRouter();
  const { connectionStatus, publish, connect, broker } = useMQTT();

  // 设备状态
  const [deviceStates, setDeviceStates] = useState<Record<string, boolean>>({});

  // 发送状态
  const [sending, setSending] = useState<string | null>(null);

  // 初始化设备状态
  useEffect(() => {
    const initialStates: Record<string, boolean> = {};
    DEVICE_CONTROLS.forEach((device) => {
      initialStates[device.id] = false;
    });
    setDeviceStates(initialStates);
  }, []);

  // 处理设备切换
  const handleToggleDevice = async (device: DeviceControl) => {
    // 如果未连接，尝试连接
    if (connectionStatus !== "connected") {
      Alert.alert("未连接", "请先连接 MQTT Broker", [
        { text: "取消", style: "cancel" },
        {
          text: "连接",
          onPress: () => {
            connect(broker);
          },
        },
      ]);
      return;
    }

    const newState = !deviceStates[device.id];
    const payload = newState ? device.payloadOn : device.payloadOff;

    // 发送消息
    setSending(device.id);
    publish(device.topic, payload, QoS.QOS_1);

    // 更新状态
    setDeviceStates((prev) => ({
      ...prev,
      [device.id]: newState,
    }));

    // 模拟发送延迟
    setTimeout(() => {
      setSending(null);
    }, 500);
  };

  // 渲染设备项
  const renderDeviceItem = (device: DeviceControl) => {
    const isOn = deviceStates[device.id];
    const isSending = sending === device.id;

    return (
      <Pressable
        key={device.id}
        style={[styles.deviceItem, isOn && styles.deviceItemOn]}
        onPress={() => handleToggleDevice(device)}
      >
        <View style={styles.deviceIcon}>
          <Ionicons
            name={device.icon as any}
            size={32}
            color={isOn ? "#4CAF50" : "#666"}
          />
        </View>

        <View style={styles.deviceInfo}>
          <Text style={[styles.deviceName, isOn && styles.deviceNameOn]}>
            {device.name}
          </Text>
          <Text style={styles.deviceTopic}>{device.topic}</Text>
          <Text style={styles.deviceDescription}>{device.description}</Text>
        </View>

        <View style={styles.deviceSwitch}>
          {isSending ? (
            <Ionicons name="sync" size={24} color="#4FC3F7" />
          ) : (
            <Switch
              value={isOn}
              onValueChange={() => handleToggleDevice(device)}
              trackColor={{ false: "#3e3e3e", true: "rgba(76,175,80,0.3)" }}
              thumbColor={isOn ? "#4CAF50" : "#f4f3f4"}
            />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>设备控制</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 连接状态 */}
      <View style={styles.statusBar}>
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor:
                connectionStatus === "connected" ? "#4CAF50" : "#F44336",
            },
          ]}
        />
        <Text style={styles.statusText}>
          {connectionStatus === "connected" ? "已连接" : "未连接"}
        </Text>
        {connectionStatus !== "connected" && (
          <Pressable
            style={styles.connectBtn}
            onPress={() => connect(broker)}
          >
            <Text style={styles.connectBtnText}>连接</Text>
          </Pressable>
        )}
      </View>

      {/* 设备列表 */}
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>设备列表</Text>
          <Text style={styles.sectionSubtitle}>
            点击开关控制设备，消息将发送到对应主题
          </Text>
        </View>

        <View style={styles.deviceList}>
          {DEVICE_CONTROLS.map(renderDeviceItem)}
        </View>

        {/* 发送记录 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>当前状态</Text>
          <View style={styles.logContainer}>
            {Object.entries(deviceStates).map(([id, isOn]) => {
              const device = DEVICE_CONTROLS.find((d) => d.id === id);
              if (!device) return null;

              return (
                <View key={id} style={styles.logItem}>
                  <View style={styles.logHeader}>
                    <Text style={styles.logDeviceName}>{device.name}</Text>
                    <Text style={[styles.logStatus, isOn && styles.logStatusOn]}>
                      {isOn ? "开启" : "关闭"}
                    </Text>
                  </View>
                  <Text style={styles.logTopic}>{device.topic}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 使用说明 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>使用说明</Text>
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              1. 确保已连接到 MQTT Broker{"\n"}
              2. 点击设备开关发送控制指令{"\n"}
              3. 消息格式为 JSON，包含设备状态{"\n"}
              4. 订阅对应主题的设备将接收指令
            </Text>
          </View>
        </View>

        {/* 底部间距 */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1c1c1e",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
  },
  connectBtn: {
    backgroundColor: "rgba(79,195,247,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  connectBtnText: {
    color: "#4FC3F7",
    fontSize: 13,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: "#888",
    fontSize: 14,
  },
  deviceList: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  deviceItemOn: {
    backgroundColor: "rgba(76,175,80,0.1)",
    borderWidth: 1,
    borderColor: "rgba(76,175,80,0.3)",
  },
  deviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2c2c2e",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  deviceNameOn: {
    color: "#4CAF50",
  },
  deviceTopic: {
    color: "#4FC3F7",
    fontSize: 12,
    marginBottom: 4,
  },
  deviceDescription: {
    color: "#888",
    fontSize: 13,
  },
  deviceSwitch: {
    marginLeft: 12,
  },
  logContainer: {
    backgroundColor: "#1c1c1e",
    borderRadius: 10,
    padding: 12,
  },
  logItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c2e",
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  logDeviceName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  logStatus: {
    color: "#888",
    fontSize: 13,
  },
  logStatusOn: {
    color: "#4CAF50",
  },
  logTopic: {
    color: "#4FC3F7",
    fontSize: 12,
  },
  helpContainer: {
    backgroundColor: "#1c1c1e",
    borderRadius: 10,
    padding: 16,
  },
  helpText: {
    color: "#888",
    fontSize: 14,
    lineHeight: 22,
  },
});
