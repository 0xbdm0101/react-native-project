import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScanStatus } from "../constants";

interface ScanButtonProps {
  status: ScanStatus;
  onPress: () => void;
}

export function ScanButton({ status, onPress }: ScanButtonProps) {
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === "scanning") {
      const animation = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      animation.start();

      return () => animation.stop();
    } else {
      rotationAnim.setValue(0);
    }
  }, [status, rotationAnim]);

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const getIconName = () => {
    switch (status) {
      case "scanning":
        return "sync";
      case "error":
        return "alert-circle";
      default:
        return "bluetooth";
    }
  };

  const getLabel = () => {
    switch (status) {
      case "scanning":
        return "扫描中...";
      case "error":
        return "扫描出错";
      default:
        return "开始扫描";
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case "scanning":
        return "rgba(79,195,247,0.3)";
      case "error":
        return "rgba(244,67,54,0.2)";
      default:
        return "rgba(79,195,247,0.15)";
    }
  };

  return (
    <Pressable
      style={[styles.button, { backgroundColor: getBackgroundColor() }]}
      onPress={onPress}
      disabled={status === "scanning"}
    >
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <Ionicons
          name={getIconName()}
          size={24}
          color={status === "error" ? "#F44336" : "#4FC3F7"}
        />
      </Animated.View>
      <Text
        style={[
          styles.label,
          { color: status === "error" ? "#F44336" : "#4FC3F7" },
        ]}
      >
        {getLabel()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
});
