import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScanStatus, getScanStatusText } from "../constants";

interface ScanButtonProps {
  status: ScanStatus;
  onPress: () => void;
}

export function ScanButton({ status, onPress }: ScanButtonProps) {
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === ScanStatus.SCANNING) {
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
      case ScanStatus.SCANNING:
        return "sync";
      case ScanStatus.ERROR:
        return "alert-circle";
      default:
        return "bluetooth";
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case ScanStatus.SCANNING:
        return "rgba(79,195,247,0.3)";
      case ScanStatus.ERROR:
        return "rgba(244,67,54,0.2)";
      default:
        return "rgba(79,195,247,0.15)";
    }
  };

  return (
    <Pressable
      style={[styles.button, { backgroundColor: getBackgroundColor() }]}
      onPress={onPress}
      disabled={status === ScanStatus.SCANNING}
    >
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <Ionicons
          name={getIconName()}
          size={24}
          color={status === ScanStatus.ERROR ? "#F44336" : "#4FC3F7"}
        />
      </Animated.View>
      <Text
        style={[
          styles.label,
          { color: status === ScanStatus.ERROR ? "#F44336" : "#4FC3F7" },
        ]}
      >
        {getScanStatusText(status)}
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
