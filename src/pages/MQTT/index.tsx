import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMQTT } from "./hooks/useMQTT";
import { BrokerCard } from "./components/BrokerCard";
import {
  MQTTBroker,
  Protocol,
  QoS,
  DEFAULT_BROKER,
  formatTimestamp,
  getQoSText,
} from "./constants";

export default function MQTTPage() {
  const router = useRouter();
  const {
    connectionStatus,
    broker,
    topics,
    messages,
    error,
    isLoadingConfig,
    savedBrokers,
    saveBrokerToList,
    removeBrokerFromList,
    clearAllBrokers,
    selectSavedBroker,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    clearMessages,
    clearError,
  } = useMQTT();

  // 表单状态
  const [showBrokerForm, setShowBrokerForm] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveAlias, setSaveAlias] = useState("");
  const [brokerForm, setBrokerForm] = useState<MQTTBroker>(DEFAULT_BROKER);
  const [topicInput, setTopicInput] = useState("");
  const [topicQoS, setTopicQoS] = useState<QoS>(QoS.QOS_0);
  const [messageInput, setMessageInput] = useState("");
  const [messageTopic, setMessageTopic] = useState("");

  // 处理连接
  const handleConnect = () => {
    if (showBrokerForm) {
      connect(brokerForm);
    } else {
      connect(broker);
    }
  };

  // 处理断开
  const handleDisconnect = () => {
    disconnect();
  };

  // 处理编辑
  const handleEditBroker = () => {
    setBrokerForm(broker);
    setShowBrokerForm(true);
  };

  // 处理保存配置
  const handleSaveBroker = () => {
    if (saveAlias.trim()) {
      saveBrokerToList(broker, saveAlias.trim());
      setSaveAlias("");
      setShowSaveDialog(false);
    }
  };

  // 处理选择配置
  const handleSelectBroker = (savedBroker: any) => {
    selectSavedBroker(savedBroker);
    setShowSavedList(false);
    // 如果当前已连接，断开后重新连接
    if (connectionStatus === "connected") {
      disconnect();
    }
  };

  // 处理删除配置
  const handleDeleteBroker = (brokerId: string) => {
    Alert.alert("确认删除", "确定要删除这个 Broker 配置吗？", [
      { text: "取消", style: "cancel" },
      { text: "删除", style: "destructive", onPress: () => removeBrokerFromList(brokerId) },
    ]);
  };

  // 处理订阅
  const handleSubscribe = () => {
    if (topicInput.trim()) {
      subscribe(topicInput.trim(), topicQoS);
      setTopicInput("");
    }
  };

  // 处理取消订阅
  const handleUnsubscribe = (topic: string) => {
    unsubscribe(topic);
  };

  // 处理发送
  const handlePublish = () => {
    if (messageTopic.trim() && messageInput.trim()) {
      publish(messageTopic.trim(), messageInput.trim());
      setMessageInput("");
    }
  };

  // 渲染 Broker 表单
  const renderBrokerForm = () => {
    if (!showBrokerForm) return null;

    return (
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Broker 配置</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>名称</Text>
          <TextInput
            style={styles.input}
            value={brokerForm.name}
            onChangeText={(text) => setBrokerForm({ ...brokerForm, name: text })}
            placeholder="我的 Broker"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>地址</Text>
          <TextInput
            style={styles.input}
            value={brokerForm.host}
            onChangeText={(text) => setBrokerForm({ ...brokerForm, host: text })}
            placeholder="broker.emqx.io"
            placeholderTextColor="#666"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>端口</Text>
            <TextInput
              style={styles.input}
              value={String(brokerForm.port)}
              onChangeText={(text) =>
                setBrokerForm({ ...brokerForm, port: parseInt(text) || 1883 })
              }
              placeholder="1883"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
            <Text style={styles.inputLabel}>协议</Text>
            <View style={styles.protocolButtons}>
              {Object.values(Protocol).map((p) => (
                <Pressable
                  key={p}
                  style={[
                    styles.protocolBtn,
                    brokerForm.protocol === p && styles.protocolBtnActive,
                  ]}
                  onPress={() => setBrokerForm({ ...brokerForm, protocol: p })}
                >
                  <Text
                    style={[
                      styles.protocolBtnText,
                      brokerForm.protocol === p && styles.protocolBtnTextActive,
                    ]}
                  >
                    {p.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>用户名（可选）</Text>
          <TextInput
            style={styles.input}
            value={brokerForm.username || ""}
            onChangeText={(text) =>
              setBrokerForm({ ...brokerForm, username: text || null })
            }
            placeholder="留空表示无需认证"
            placeholderTextColor="#666"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>密码（可选）</Text>
          <TextInput
            style={styles.input}
            value={brokerForm.password || ""}
            onChangeText={(text) =>
              setBrokerForm({ ...brokerForm, password: text || null })
            }
            placeholder="留空表示无需认证"
            placeholderTextColor="#666"
            secureTextEntry
          />
        </View>

        <View style={styles.formActions}>
          <Pressable
            style={styles.cancelBtn}
            onPress={() => setShowBrokerForm(false)}
          >
            <Text style={styles.cancelBtnText}>取消</Text>
          </Pressable>
          <Pressable style={styles.saveBtn} onPress={handleConnect}>
            <Text style={styles.saveBtnText}>连接</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  // 渲染主题列表
  const renderTopics = () => {
    if (topics.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>已订阅主题</Text>
        {topics.map((topic) => (
          <View key={topic.topic} style={styles.topicItem}>
            <View style={styles.topicInfo}>
              <Text style={styles.topicName}>{topic.topic}</Text>
              <Text style={styles.topicMeta}>
                QoS {topic.qos} · {topic.messageCount} 条消息
              </Text>
            </View>
            <Pressable
              style={styles.unsubscribeBtn}
              onPress={() => handleUnsubscribe(topic.topic)}
            >
              <Ionicons name="close" size={16} color="#F44336" />
            </Pressable>
          </View>
        ))}
      </View>
    );
  };

  // 渲染消息列表
  const renderMessages = () => {
    if (messages.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>消息</Text>
          <Pressable style={styles.clearBtn} onPress={clearMessages}>
            <Text style={styles.clearBtnText}>清空</Text>
          </Pressable>
        </View>
        {messages.slice(0, 50).map((msg) => (
          <View key={msg.id} style={styles.messageItem}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageTopic}>{msg.topic}</Text>
              <Text style={styles.messageTime}>
                {formatTimestamp(msg.timestamp)}
              </Text>
            </View>
            <Text style={styles.messagePayload}>{msg.payload}</Text>
            <View style={styles.messageMeta}>
              <Text style={styles.messageQoS}>QoS {msg.qos}</Text>
              <Text style={styles.messageDirection}>
                {msg.direction === "inbound" ? "← 接收" : "→ 发送"}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>MQTT</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* 错误提示 */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color="#F44336" />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={clearError}>
              <Ionicons name="close" size={18} color="#888" />
            </Pressable>
          </View>
        )}

        {/* Broker 卡片 */}
        <BrokerCard
          broker={broker}
          connectionStatus={connectionStatus}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onEdit={handleEditBroker}
        />

        {/* 配置管理按钮 */}
        <View style={styles.configActions}>
          <Pressable
            style={styles.configBtn}
            onPress={() => setShowSaveDialog(true)}
          >
            <Ionicons name="bookmark-outline" size={18} color="#4FC3F7" />
            <Text style={styles.configBtnText}>保存配置</Text>
          </Pressable>
          <Pressable
            style={styles.configBtn}
            onPress={() => setShowSavedList(!showSavedList)}
          >
            <Ionicons name="list-outline" size={18} color="#4FC3F7" />
            <Text style={styles.configBtnText}>
              已保存 ({savedBrokers.length})
            </Text>
          </Pressable>
        </View>

        {/* 保存配置弹窗 */}
        {showSaveDialog && (
          <View style={styles.saveDialog}>
            <Text style={styles.saveDialogTitle}>保存 Broker 配置</Text>
            <TextInput
              style={styles.input}
              value={saveAlias}
              onChangeText={setSaveAlias}
              placeholder="输入配置名称（如：我的 Broker）"
              placeholderTextColor="#666"
            />
            <View style={styles.saveDialogActions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => {
                  setShowSaveDialog(false);
                  setSaveAlias("");
                }}
              >
                <Text style={styles.cancelBtnText}>取消</Text>
              </Pressable>
              <Pressable style={styles.saveBtn} onPress={handleSaveBroker}>
                <Text style={styles.saveBtnText}>保存</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* 已保存配置列表 */}
        {showSavedList && savedBrokers.length > 0 && (
          <View style={styles.savedList}>
            <View style={styles.savedListHeader}>
              <Text style={styles.savedListTitle}>已保存的配置</Text>
              <Pressable onPress={clearAllBrokers}>
                <Text style={styles.clearAllText}>清空</Text>
              </Pressable>
            </View>
            {savedBrokers.map((savedBroker) => (
              <View key={savedBroker.id} style={styles.savedItem}>
                <Pressable
                  style={styles.savedItemContent}
                  onPress={() => handleSelectBroker(savedBroker)}
                >
                  <View style={styles.savedItemInfo}>
                    <Text style={styles.savedItemName}>{savedBroker.alias}</Text>
                    <Text style={styles.savedItemHost}>
                      {savedBroker.host}:{savedBroker.port}
                    </Text>
                    <Text style={styles.savedItemMeta}>
                      连接 {savedBroker.connectCount} 次
                      {savedBroker.lastConnected &&
                        ` · ${new Date(savedBroker.lastConnected).toLocaleDateString()}`}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </Pressable>
                <Pressable
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteBroker(savedBroker.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#F44336" />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Broker 表单 */}
        {renderBrokerForm()}

        {/* 订阅主题 */}
        {connectionStatus === "connected" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>订阅主题</Text>
            <View style={styles.subscribeRow}>
              <TextInput
                style={styles.subscribeInput}
                value={topicInput}
                onChangeText={setTopicInput}
                placeholder="输入主题名（支持通配符 + #）"
                placeholderTextColor="#666"
                autoCapitalize="none"
              />
              <Pressable style={styles.subscribeBtn} onPress={handleSubscribe}>
                <Ionicons name="add" size={20} color="#fff" />
              </Pressable>
            </View>

            {/* QoS 选择器 */}
            <View style={styles.qosSelector}>
              <Text style={styles.qosLabel}>QoS 等级：</Text>
              <View style={styles.qosButtons}>
                {Object.values(QoS)
                  .filter((v) => typeof v === "number")
                  .map((qos) => (
                    <Pressable
                      key={qos}
                      style={[
                        styles.qosBtn,
                        topicQoS === qos && styles.qosBtnActive,
                      ]}
                      onPress={() => setTopicQoS(qos as QoS)}
                    >
                      <Text
                        style={[
                          styles.qosBtnText,
                          topicQoS === qos && styles.qosBtnTextActive,
                        ]}
                      >
                        {qos}
                      </Text>
                    </Pressable>
                  ))}
              </View>
              <Text style={styles.qosHint}>
                {getQoSText(topicQoS)}
              </Text>
            </View>
          </View>
        )}

        {/* 发送消息 */}
        {connectionStatus === "connected" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>发送消息</Text>
            <TextInput
              style={styles.input}
              value={messageTopic}
              onChangeText={setMessageTopic}
              placeholder="主题"
              placeholderTextColor="#666"
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, styles.messageInput]}
              value={messageInput}
              onChangeText={setMessageInput}
              placeholder="消息内容"
              placeholderTextColor="#666"
              multiline
            />
            <Pressable style={styles.publishBtn} onPress={handlePublish}>
              <Ionicons name="send" size={18} color="#fff" />
              <Text style={styles.publishBtnText}>发送</Text>
            </Pressable>
          </View>
        )}

        {/* 主题列表 */}
        {renderTopics()}

        {/* 消息列表 */}
        {renderMessages()}

        {/* 跳转到设备操作页面 */}
        <View style={styles.section}>
          <Pressable
            style={styles.operationBtn}
            onPress={() => router.push("/mqtt-operations")}
          >
            <Ionicons name="hardware-chip-outline" size={24} color="#4CAF50" />
            <View style={styles.operationBtnContent}>
              <Text style={styles.operationBtnTitle}>设备控制</Text>
              <Text style={styles.operationBtnSubtitle}>
                点击进入设备操作页面
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

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
  backBtn: { padding: 8 },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: { width: 40 },
  content: {
    flex: 1,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244,67,54,0.15)",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  errorText: {
    color: "#F44336",
    fontSize: 14,
    flex: 1,
  },
  formCard: {
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  formTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#2c2c2e",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 14,
  },
  inputRow: {
    flexDirection: "row",
  },
  protocolButtons: {
    flexDirection: "row",
    gap: 8,
  },
  protocolBtn: {
    flex: 1,
    backgroundColor: "#2c2c2e",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  protocolBtnActive: {
    backgroundColor: "rgba(79,195,247,0.2)",
  },
  protocolBtnText: {
    color: "#888",
    fontSize: 12,
  },
  protocolBtnTextActive: {
    color: "#4FC3F7",
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelBtnText: {
    color: "#888",
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: "rgba(79,195,247,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveBtnText: {
    color: "#4FC3F7",
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  subscribeRow: {
    flexDirection: "row",
    gap: 8,
  },
  subscribeInput: {
    flex: 1,
    backgroundColor: "#2c2c2e",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 14,
  },
  subscribeBtn: {
    backgroundColor: "rgba(79,195,247,0.2)",
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  topicItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  topicMeta: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  unsubscribeBtn: {
    padding: 8,
  },
  messageInput: {
    minHeight: 80,
    textAlignVertical: "top",
    marginTop: 8,
  },
  publishBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(76,175,80,0.2)",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
  },
  publishBtnText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    color: "#888",
    fontSize: 13,
  },
  qosSelector: {
    marginTop: 12,
  },
  qosLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 8,
  },
  qosButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  qosBtn: {
    flex: 1,
    backgroundColor: "#2c2c2e",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  qosBtnActive: {
    backgroundColor: "rgba(79,195,247,0.2)",
  },
  qosBtnText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
  qosBtnTextActive: {
    color: "#4FC3F7",
  },
  qosHint: {
    color: "#666",
    fontSize: 11,
  },
  messageItem: {
    backgroundColor: "#1c1c1e",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  messageTopic: {
    color: "#4FC3F7",
    fontSize: 13,
    fontWeight: "500",
  },
  messageTime: {
    color: "#666",
    fontSize: 12,
  },
  messagePayload: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 6,
  },
  messageMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  messageQoS: {
    color: "#888",
    fontSize: 11,
  },
  messageDirection: {
    color: "#888",
    fontSize: 11,
  },
  configActions: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  configBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(79,195,247,0.1)",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  configBtnText: {
    color: "#4FC3F7",
    fontSize: 14,
    fontWeight: "500",
  },
  saveDialog: {
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  saveDialogTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  saveDialogActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  savedList: {
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  savedListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c2e",
  },
  savedListTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  clearAllText: {
    color: "#F44336",
    fontSize: 14,
  },
  savedItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c2e",
  },
  savedItemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  savedItemInfo: {
    flex: 1,
  },
  savedItemName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  savedItemHost: {
    color: "#4FC3F7",
    fontSize: 13,
    marginTop: 2,
  },
  savedItemMeta: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  deleteBtn: {
    padding: 16,
  },
  operationBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76,175,80,0.15)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(76,175,80,0.3)",
  },
  operationBtnContent: {
    flex: 1,
    marginLeft: 12,
  },
  operationBtnTitle: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
  },
  operationBtnSubtitle: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },
});
