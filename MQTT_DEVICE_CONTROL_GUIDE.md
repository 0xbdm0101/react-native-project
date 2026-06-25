# MQTT 设备控制页面使用指南

## 功能说明

设备控制页面提供了一个**用户友好的界面**，让你可以：
- ✅ 通过开关控制设备
- ✅ 自动发送 MQTT 消息
- ✅ 查看发送记录
- ✅ 无需手动输入主题和消息

---

## 页面入口

### 从 MQTT 调试页面进入
1. 打开 App，进入 MQTT 页面
2. 滚动到底部
3. 点击「设备控制」按钮

---

## 页面功能

### 1. 连接状态显示
- **已连接**：绿色指示灯，可以控制设备
- **未连接**：红色指示灯，点击「连接」按钮连接 Broker

### 2. 设备控制列表
每个设备显示：
- **设备图标**：直观显示设备类型
- **设备名称**：如"客厅灯"、"风扇"
- **主题地址**：消息发送到的主题
- **设备描述**：设备功能说明
- **开关按钮**：点击切换设备状态

### 3. 发送记录
显示每个设备的：
- 主题地址
- 当前状态的消息内容

### 4. 使用说明
简要说明如何使用设备控制功能

---

## 预置设备

### 1. 客厅灯
- **主题**：`home/livingroom/light`
- **开灯消息**：`{"state": "ON"}`
- **关灯消息**：`{"state": "OFF"}`

### 2. 风扇
- **主题**：`home/livingroom/fan`
- **开风扇消息**：`{"state": "ON", "speed": 3}`
- **关风扇消息**：`{"state": "OFF"}`

### 3. 空调
- **主题**：`home/bedroom/ac`
- **开空调消息**：`{"state": "ON", "temp": 26, "mode": "cool"}`
- **关空调消息**：`{"state": "OFF"}`

### 4. 窗帘
- **主题**：`home/livingroom/curtain`
- **开窗帘消息**：`{"state": "OPEN"}`
- **关窗帘消息**：`{"state": "CLOSE"}`

### 5. 电视
- **主题**：`home/livingroom/tv`
- **开电视消息**：`{"state": "ON", "channel": 1}`
- **关电视消息**：`{"state": "OFF"}`

### 6. 音响
- **主题**：`home/livingroom/speaker`
- **开音响消息**：`{"state": "ON", "volume": 50}`
- **关音响消息**：`{"state": "OFF"}`

---

## 使用步骤

### 步骤 1：连接 Broker
1. 进入设备控制页面
2. 如果显示"未连接"，点击「连接」按钮
3. 等待连接成功（显示"已连接"）

### 步骤 2：控制设备
1. 找到要控制的设备
2. 点击设备右侧的开关按钮
3. 开关切换表示消息已发送

### 步骤 3：查看记录
1. 滚动到"发送记录"部分
2. 查看每个设备的当前状态和消息内容

---

## 与 ESP32 设备配合

### ESP32 端需要做的
1. 连接到同一个 MQTT Broker
2. 订阅对应的主题（如 `home/livingroom/light`）
3. 接收消息并控制设备

### 示例 ESP32 代码
```cpp
#include <WiFi.h>
#include <PubSubClient.h>

// WiFi 配置
const char* ssid = "your_wifi";
const char* password = "your_password";

// MQTT 配置
const char* mqtt_server = "broker.emqx.io";
const int mqtt_port = 1883;
const char* topic = "home/livingroom/light";

WiFiClient espClient;
PubSubClient client(espClient);

void callback(char* topic, byte* payload, unsigned int length) {
  // 解析消息
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  // 控制 LED
  if (message.indexOf("\"state\": \"ON\"") >= 0) {
    digitalWrite(LED_PIN, HIGH);  // 开灯
  } else if (message.indexOf("\"state\": \"OFF\"") >= 0) {
    digitalWrite(LED_PIN, LOW);   // 关灯
  }
}

void setup() {
  // 连接 WiFi
  WiFi.begin(ssid, password);

  // 连接 MQTT
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  // 订阅主题
  client.subscribe(topic);
}

void loop() {
  client.loop();
}
```

---

## 自定义设备

### 修改设备列表
编辑 `src/pages/MQTT/operations.tsx` 文件中的 `DEVICE_CONTROLS` 数组：

```typescript
const DEVICE_CONTROLS: DeviceControl[] = [
  {
    id: "my_device",           // 设备 ID
    name: "我的设备",           // 显示名称
    icon: "bulb-outline",      // 图标名称
    topic: "home/my/device",   // MQTT 主题
    payloadOn: '{"state": "ON"}',   // 开启消息
    payloadOff: '{"state": "OFF"}', // 关闭消息
    description: "控制我的设备",     // 设备描述
  },
  // ... 更多设备
];
```

### 可用图标
- `bulb-outline` - 灯泡
- `fan-outline` - 风扇
- `snow-outline` - 空调/雪花
- `menu-outline` - 窗帘
- `tv-outline` - 电视
- `volume-high-outline` - 音响
- `water-outline` - 水泵
- `thermometer-outline` - 温度计
- `lock-closed-outline` - 门锁
- `camera-outline` - 摄像头

---

## 测试步骤

### 测试 1：基础控制
1. 连接到 MQTT Broker
2. 点击"客厅灯"开关
3. 观察开关状态变化
4. 查看发送记录

### 测试 2：MQTTX 验证
1. 打开 MQTTX
2. 连接到同一个 Broker
3. 订阅主题：`home/livingroom/light`
4. 在 App 中点击"客厅灯"开关
5. 在 MQTTX 中查看收到的消息

### 测试 3：ESP32 验证
1. ESP32 连接到同一个 Broker
2. ESP32 订阅主题：`home/livingroom/light`
3. 在 App 中点击"客厅灯"开关
4. 观察 ESP32 控制的 LED 是否亮起

---

## 常见问题

### Q1: 点击开关没反应？
**可能原因**：
- 未连接到 Broker
- 网络问题

**解决方法**：
1. 检查连接状态
2. 点击「连接」按钮重新连接
3. 检查网络连接

---

### Q2: 如何添加新设备？
**方法**：
1. 编辑 `src/pages/MQTT/operations.tsx`
2. 在 `DEVICE_CONTROLS` 数组中添加新设备
3. 重新编译 App

---

### Q3: 如何修改消息格式？
**方法**：
1. 编辑 `src/pages/MQTT/operations.tsx`
2. 修改对应设备的 `payloadOn` 和 `payloadOff`
3. 确保 ESP32 端能正确解析

---

### Q4: 支持 QoS 设置吗？
**当前**：使用 QoS 1（至少一次）

**修改方法**：
1. 编辑 `operations.tsx`
2. 找到 `publish` 调用
3. 修改 QoS 参数

---

## 下一步

### 功能扩展
- 添加更多设备类型
- 支持设备分组
- 添加设备状态反馈
- 支持场景模式

### 界面优化
- 添加设备图标动画
- 支持设备排序
- 添加设备搜索
- 支持主题切换

---

## 技术实现

### 消息格式
```typescript
interface DeviceControl {
  id: string;           // 设备唯一标识
  name: string;         // 显示名称
  icon: string;         // 图标名称
  topic: string;        // MQTT 主题
  payloadOn: string;    // 开启消息（JSON）
  payloadOff: string;   // 关闭消息（JSON）
  description: string;  // 设备描述
}
```

### 状态管理
- 使用 `useState` 管理设备状态
- 使用 `useMQTT` Hook 发送消息
- 状态变化时自动更新 UI

### 消息发送
```typescript
// 发送开启消息
publish(device.topic, device.payloadOn, QoS.QOS_1);

// 发送关闭消息
publish(device.topic, device.payloadOff, QoS.QOS_1);
```

---

## 总结

设备控制页面让你可以：
- ✅ 像控制真实设备一样控制 MQTT 设备
- ✅ 无需记忆主题和消息格式
- ✅ 直观的开关界面
- ✅ 实时查看发送记录

现在你可以像使用普通智能家居 App 一样使用 MQTT 了！🎉
