/**
 * BLE 蓝牙协议定义
 * 包含标准 Bluetooth SIG UUID 和设备类型映射
 */

// ==================== 标准服务 UUID ====================
export const BLE_SERVICES: Record<string, string> = {
  // 通用服务
  '1800': '通用访问服务',
  '1801': '通用属性服务',
  '180A': '设备信息服务',
  '180F': '电池服务',
  '1810': '血压服务',
  '1811': '警报服务',
  '1812': '人机接口设备服务',
  '1813': '扫描参数服务',
  '1814': '跑步速度和节奏服务',
  '1815': '自动化 IO 服务',
  '1816': '循环速度和节奏服务',
  '1818': '功率服务',
  '1819': '位置和导航服务',
  '181A': '环境传感服务',
  '181B': '身体组成服务',
  '181C': '用户数据服务',
  '181D': '体重秤服务',
  '181E': '绑定管理服务',
  '181F': '连续血糖监测服务',
  '1820': '互联网协议支持服务',

  // 苹果私有服务
  'FE95': '小米 BLE 服务',
  'FE96': '小米 FastPair 服务',
  'FE2C': '苹果 AirPods 服务',
  'FD44': '苹果设备信息服务',
  'FEAA': '苹果 iBeacon 服务',
};

// ==================== 标准特征值 UUID ====================
export const BLE_CHARACTERISTICS: Record<string, string> = {
  // 设备信息服务特征值
  '2A29': '制造商名称',
  '2A24': '型号',
  '2A25': '序列号',
  '2A26': '固件版本',
  '2A27': '硬件版本',
  '2A28': '软件版本',
  '2A23': '系统 ID',
  '2A2A': 'IEEE 11073 认证',

  // 电池服务特征值
  '2A19': '电池电量',
  '2A1A': '电池电量状态',

  // 环境传感服务特征值
  '2A6E': '温度',
  '2A6F': '湿度',
  '2A7D': '紫外线指数',
  '2A7F': '气压',
  '2A6D': '压力',
  '2A6C': '海拔',
  '2A73': '风向',
  '2A72': '风速',
  '2A7B': '露点温度',
  '2A7A': '可见光强度',
  '2A75': '磁通密度',
  '2A76': '花粉浓度',

  // 通用访问特征值
  '2A00': '设备名称',
  '2A01': '外观',
  '2A02': '外围设备隐私标志',
  '2A03': '重连地址',
  '2A04': '连接参数',

  // 通用属性特征值
  '2A05': '服务更改',
  '2A06': '警报级别',
  '2A07': '发射功率级别',
  '2A08': '日期时间',
  '2A09': '星期几',

  // 人机接口设备特征值
  '2A4A': 'HID 信息',
  '2A4B': '报告',
  '2A4C': '协议模式',
  '2A4D': '报告',
  '2A4E': '协议模式',

  // 心率服务特征值
  '2A37': '心率测量',
  '2A38': '身体传感器位置',

  // 运动服务特征值
  '2A53': '步数',
  '2A54': '跑步速度',
  '2A55': '节奏',
};

// ==================== 设备类型映射 ====================
export const DEVICE_TYPES: Record<string, {
  icon: string;
  category: string;
  description: string;
}> = {
  // 音频设备
  'airpods': {
    icon: 'headset',
    category: '音频设备',
    description: '苹果 AirPods',
  },
  'airpods_pro': {
    icon: 'headset',
    category: '音频设备',
    description: '苹果 AirPods Pro',
  },
  'airpods_max': {
    icon: 'headset',
    category: '音频设备',
    description: '苹果 AirPods Max',
  },
  'beats': {
    icon: 'headset',
    category: '音频设备',
    description: 'Beats 耳机',
  },
  'speaker': {
    icon: 'volume-high',
    category: '音频设备',
    description: '蓝牙音箱',
  },

  // 可穿戴设备
  'apple_watch': {
    icon: 'watch',
    category: '可穿戴设备',
    description: 'Apple Watch',
  },
  'fitness_tracker': {
    icon: 'fitness',
    category: '可穿戴设备',
    description: '健身追踪器',
  },
  'smart_ring': {
    icon: 'finger-print',
    category: '可穿戴设备',
    description: '智能戒指',
  },

  // 输入设备
  'keyboard': {
    icon: 'keyboard',
    category: '输入设备',
    description: '蓝牙键盘',
  },
  'mouse': {
    icon: 'mouse',
    category: '输入设备',
    description: '蓝牙鼠标',
  },
  'gamepad': {
    icon: 'game-controller',
    category: '输入设备',
    description: '游戏手柄',
  },

  // IoT 设备
  'sensor': {
    icon: 'thermometer',
    category: '传感器',
    description: '传感器设备',
  },
  'light': {
    icon: 'bulb',
    category: '智能家居',
    description: '智能灯',
  },
  'lock': {
    icon: 'lock-closed',
    category: '智能家居',
    description: '智能门锁',
  },
  'plug': {
    icon: 'power',
    category: '智能家居',
    description: '智能插座',
  },
  'camera': {
    icon: 'camera',
    category: '智能家居',
    description: '智能摄像头',
  },

  // 位置设备
  'tracker': {
    icon: 'location',
    category: '位置设备',
    description: '位置追踪器',
  },
  'beacon': {
    icon: 'radio',
    category: '位置设备',
    description: '信标设备',
  },
};

// ==================== 工具函数 ====================

/**
 * 获取服务名称
 */
export function getServiceName(uuid: string): string {
  const upperUUID = uuid.toUpperCase();
  return BLE_SERVICES[upperUUID] || `自定义服务 (${uuid.substring(0, 8)}...)`;
}

/**
 * 获取特征值名称
 */
export function getCharacteristicName(uuid: string): string {
  const upperUUID = uuid.toUpperCase();
  return BLE_CHARACTERISTICS[upperUUID] || `自定义特征值 (${uuid.substring(0, 8)}...)`;
}

/**
 * 根据设备名称猜测设备类型
 */
export function guessDeviceType(deviceName: string): string | null {
  const name = deviceName.toLowerCase();

  if (name.includes('airpods') && name.includes('pro')) return 'airpods_pro';
  if (name.includes('airpods') && name.includes('max')) return 'airpods_max';
  if (name.includes('airpods')) return 'airpods';
  if (name.includes('beats')) return 'beats';
  if (name.includes('watch')) return 'apple_watch';
  if (name.includes('keyboard') || name.includes('键盘')) return 'keyboard';
  if (name.includes('mouse') || name.includes('鼠标')) return 'mouse';
  if (name.includes('speaker') || name.includes('音箱')) return 'speaker';
  if (name.includes('light') || name.includes('灯')) return 'light';
  if (name.includes('lock') || name.includes('锁')) return 'lock';
  if (name.includes('sensor') || name.includes('传感器')) return 'sensor';
  if (name.includes('tracker') || name.includes('追踪')) return 'tracker';

  return null;
}

/**
 * 获取设备图标
 */
export function getDeviceIcon(deviceName: string): string {
  const deviceType = guessDeviceType(deviceName);
  if (deviceType && DEVICE_TYPES[deviceType]) {
    return DEVICE_TYPES[deviceType].icon;
  }
  return 'bluetooth';
}

/**
 * 获取设备类别
 */
export function getDeviceCategory(deviceName: string): string {
  const deviceType = guessDeviceType(deviceName);
  if (deviceType && DEVICE_TYPES[deviceType]) {
    return DEVICE_TYPES[deviceType].category;
  }
  return '未知设备';
}
