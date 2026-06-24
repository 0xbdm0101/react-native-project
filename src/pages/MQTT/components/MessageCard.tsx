import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MQTTMessage, formatTimestamp } from "../constants";

interface MessageCardProps {
  message: MQTTMessage;
}

export function MessageCard({ message }: MessageCardProps) {
  const isInbound = message.direction === "inbound";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.directionBadge}>
          <Ionicons
            name={isInbound ? "arrow-down" : "arrow-up"}
            size={12}
            color={isInbound ? "#4FC3F7" : "#4CAF50"}
          />
          <Text
            style={[
              styles.directionText,
              { color: isInbound ? "#4FC3F7" : "#4CAF50" },
            ]}
          >
            {isInbound ? "接收" : "发送"}
          </Text>
        </View>
        <Text style={styles.topic} numberOfLines={1}>
          {message.topic}
        </Text>
        <Text style={styles.time}>{formatTimestamp(message.timestamp)}</Text>
      </View>

      <Text style={styles.payload}>{message.payload}</Text>

      <View style={styles.footer}>
        <Text style={styles.qos}>QoS {message.qos}</Text>
        {message.retain && (
          <View style={styles.retainBadge}>
            <Text style={styles.retainText}>Retain</Text>
          </View>
        )}
      </View>
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
    marginBottom: 10,
  },
  directionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(79,195,247,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  directionText: {
    fontSize: 11,
    fontWeight: "500",
  },
  topic: {
    flex: 1,
    color: "#888",
    fontSize: 12,
    marginLeft: 10,
  },
  time: {
    color: "#666",
    fontSize: 11,
  },
  payload: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qos: {
    color: "#888",
    fontSize: 11,
  },
  retainBadge: {
    backgroundColor: "rgba(255,152,0,0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  retainText: {
    color: "#FF9800",
    fontSize: 10,
  },
});
