import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MQTTTopic, formatTimestamp } from "../constants";

interface TopicCardProps {
  topic: MQTTTopic;
  onUnsubscribe: (topic: string) => void;
}

export function TopicCard({ topic, onUnsubscribe }: TopicCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="pricetag" size={20} color="#4FC3F7" />
        </View>
        <View style={styles.info}>
          <Text style={styles.topicName} numberOfLines={1}>
            {topic.topic}
          </Text>
          <Text style={styles.meta}>
            QoS {topic.qos} · {topic.messageCount} 条消息
          </Text>
        </View>
        <Pressable
          style={styles.unsubscribeBtn}
          onPress={() => onUnsubscribe(topic.topic)}
        >
          <Ionicons name="close-circle" size={22} color="#F44336" />
        </Pressable>
      </View>
      <Text style={styles.time}>
        订阅时间: {formatTimestamp(topic.subscribedAt)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c1c1e",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(79,195,247,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  topicName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  meta: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  unsubscribeBtn: {
    padding: 6,
  },
  time: {
    color: "#666",
    fontSize: 11,
    marginTop: 8,
    marginLeft: 52,
  },
});
