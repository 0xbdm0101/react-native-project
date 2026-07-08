import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PageHeader } from "@/components/PageHeader";
import { MOCK_SPEAKER_STATE } from "./constants";

export function DeviceControl() {
  const [state, setState] = useState(MOCK_SPEAKER_STATE);

  const togglePlay = () => setState((s) => ({ ...s, playing: !s.playing }));
  const setVolume = (vol: number) =>
    setState((s) => ({ ...s, volume: Math.max(0, Math.min(100, vol)) }));

  return (
    <View style={styles.container}>
      {/* 顶部返回 */}
      <PageHeader title={state.deviceName} />

      {/* 设备状态 */}
      <View style={styles.deviceArea}>
        <View style={styles.deviceIcon}>
          <Ionicons name="volume-high" size={64} color="#4FC3F7" />
        </View>
        <Text style={styles.onlineText}>在线</Text>
      </View>

      {/* 当前播放 */}
      <View style={styles.songArea}>
        <Text style={styles.songName}>{state.currentSong}</Text>
      </View>

      {/* 播放控制 */}
      <View style={styles.controls}>
        <Pressable>
          <Ionicons name="play-skip-back" size={32} color="#fff" />
        </Pressable>
        <Pressable onPress={togglePlay} style={styles.playBtn}>
          <Ionicons
            name={state.playing ? "pause" : "play"}
            size={40}
            color="#000"
          />
        </Pressable>
        <Pressable>
          <Ionicons name="play-skip-forward" size={32} color="#fff" />
        </Pressable>
      </View>

      {/* 音量调节 */}
      <View style={styles.volumeArea}>
        <Ionicons name="volume-low" size={22} color="#888" />
        <View style={styles.volumeBar}>
          <View style={[styles.volumeFill, { width: `${state.volume}%` }]} />
        </View>
        <Ionicons name="volume-high" size={22} color="#888" />
      </View>
      <View style={styles.volumeBtns}>
        <Pressable onPress={() => setVolume(state.volume - 10)} style={styles.volBtn}>
          <Text style={styles.volBtnText}>-10</Text>
        </Pressable>
        <Text style={styles.volumeText}>{state.volume}%</Text>
        <Pressable onPress={() => setVolume(state.volume + 10)} style={styles.volBtn}>
          <Text style={styles.volBtnText}>+10</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  deviceArea: { alignItems: "center", marginTop: 40 },
  deviceIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(79,195,247,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  onlineText: { color: "#4CAF50", fontSize: 14, marginTop: 12 },
  songArea: { alignItems: "center", marginTop: 32 },
  songName: { color: "#fff", fontSize: 20, fontWeight: "500" },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    marginTop: 40,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#4FC3F7",
    alignItems: "center",
    justifyContent: "center",
  },
  volumeArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    marginTop: 48,
    gap: 12,
  },
  volumeBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
  },
  volumeFill: {
    height: 4,
    backgroundColor: "#4FC3F7",
    borderRadius: 2,
  },
  volumeBtns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    marginTop: 16,
  },
  volBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#1c1c1e",
    borderRadius: 8,
  },
  volBtnText: { color: "#4FC3F7", fontSize: 14, fontWeight: "600" },
  volumeText: { color: "#fff", fontSize: 16 },
});
