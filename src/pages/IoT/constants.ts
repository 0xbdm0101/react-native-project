export interface DeviceInfo {
  did: string;
  name: string;
  model: string;
  online: boolean;
  icon: string;
  room: string;
}

/** Mock 设备列表 — 后续对接小米 MIoT API 替换 */
export const DEVICE_LIST: DeviceInfo[] = [
  {
    did: "xiaomi-speaker-001",
    name: "小米音箱 Pro",
    model: "xiaomi.wifispeaker.x08a",
    online: true,
    icon: "volume-high",
    room: "客厅",
  },
];

export interface SpeakerState {
  playing: boolean;
  volume: number;
  currentSong: string;
  deviceName: string;
}

/** Mock 音箱状态 */
export const MOCK_SPEAKER_STATE: SpeakerState = {
  playing: true,
  volume: 45,
  currentSong: "周杰伦 - 晴天",
  deviceName: "小米音箱 Pro",
};
