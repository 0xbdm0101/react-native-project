import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MQTTBroker, ConnectionStatus, getConnectionStatusText } from "../constants";

interface BrokerCardProps {
  broker: MQTTBroker;
  connectionStatus: ConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
  onEdit: () => void;
}

export function BrokerCard({
  broker,
  connectionStatus,
  onConnect,
  onDisconnect,
  onEdit,
}: BrokerCardProps) {
  const isConnected = connectionStatus === ConnectionStatus.CONNECTED;
  const isConnecting = connectionStatus === ConnectionStatus.CONNECTING;

  const getStatusColor = () => {
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTED:
        return "#4CAF50";
      case ConnectionStatus.CONNECTING:
      case ConnectionStatus.RECONNECTING:
        return "#FF9800";
      case ConnectionStatus.ERROR:
        return "#F44336";
      default:
        return "#888";
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons
            name="cloud"
            size={28}
            color={isConnected ? "#4CAF50" : "#4FC3F7"}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{broker.name}</Text>
          <Text style={styles.host}>
            {broker.host}:{broker.port}
          </Text>
        </View>
        <Pressable style={styles.editBtn} onPress={onEdit}>
          <Ionicons name="create-outline" size={20} color="#888" />
        </Pressable>
      </View>

      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getConnectionStatusText(connectionStatus)}
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>协议</Text>
          <Text style={styles.detailValue}>{broker.protocol}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>客户端 ID</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            {broker.clientId}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Keep Alive</Text>
          <Text style={styles.detailValue}>{broker.keepAlive}s</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {isConnected ? (
          <Pressable style={styles.disconnectBtn} onPress={onDisconnect}>
            <Ionicons name="close-circle" size={18} color="#F44336" />
            <Text style={styles.disconnectBtnText}>断开</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.connectBtn, isConnecting && styles.connectingBtn]}
            onPress={onConnect}
            disabled={isConnecting}
          >
            <Ionicons
              name={isConnecting ? "sync" : "play"}
              size={18}
              color="#fff"
            />
            <Text style={styles.connectBtnText}>
              {isConnecting ? "连接中..." : "连接"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(79,195,247,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  host: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },
  editBtn: {
    padding: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
  },
  details: {
    flexDirection: "row",
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    color: "#666",
    fontSize: 11,
    marginBottom: 2,
  },
  detailValue: {
    color: "#fff",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  connectBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76,175,80,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  connectingBtn: {
    backgroundColor: "rgba(255,152,0,0.2)",
  },
  connectBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  disconnectBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244,67,54,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  disconnectBtnText: {
    color: "#F44336",
    fontSize: 14,
    fontWeight: "500",
  },
});
