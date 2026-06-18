const bleno = require('@abandonware/bleno');

// 温湿度传感器服务 UUID
const TEMP_HUMIDITY_SERVICE_UUID = '181A';  // 标准环境传感服务

// 特征值 UUID
const TEMPERATURE_CHAR_UUID = '2A6E';      // 温度
const HUMIDITY_CHAR_UUID = '2A6F';         // 湿度
const DEVICE_NAME_CHAR_UUID = '2A00';      // 设备名称

// 模拟数据
let temperature = 25.0;
let humidity = 60.0;

// 随机波动数据
function updateSensorData() {
  temperature += (Math.random() - 0.5) * 2;  // ±1°C 波动
  humidity += (Math.random() - 0.5) * 5;     // ±2.5% 波动

  // 限制范围
  temperature = Math.max(15, Math.min(35, temperature));
  humidity = Math.max(30, Math.min(90, humidity));
}

// 将浮点数转换为 BLE 格式 (IEEE 11073)
function formatTemperature(temp) {
  const value = Math.round(temp * 100);
  const buffer = Buffer.alloc(2);
  buffer.writeInt16LE(value);
  return buffer;
}

function formatHumidity(hum) {
  const value = Math.round(hum * 100);
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(value);
  return buffer;
}

// 温度特征值
const temperatureCharacteristic = new bleno.Characteristic({
  uuid: TEMPERATURE_CHAR_UUID,
  properties: ['read', 'notify'],
  value: null,
  onReadRequest: (offset, callback) => {
    console.log(`📖 读取温度: ${temperature.toFixed(1)}°C`);
    callback(bleno.Characteristic.RESULT_SUCCESS, formatTemperature(temperature));
  },
  onSubscribe: (maxValueSize, updateValueCallback) => {
    console.log('📡 订阅温度更新');
    const interval = setInterval(() => {
      updateSensorData();
      updateValueCallback(formatTemperature(temperature));
    }, 2000);

    // 存储 interval 用于取消订阅
    this._interval = interval;
  },
  onUnsubscribe: () => {
    console.log('❌ 取消订阅温度');
    if (this._interval) {
      clearInterval(this._interval);
    }
  }
});

// 湿度特征值
const humidityCharacteristic = new bleno.Characteristic({
  uuid: HUMIDITY_CHAR_UUID,
  properties: ['read', 'notify'],
  value: null,
  onReadRequest: (offset, callback) => {
    console.log(`📖 读取湿度: ${humidity.toFixed(1)}%`);
    callback(bleno.Characteristic.RESULT_SUCCESS, formatHumidity(humidity));
  },
  onSubscribe: (maxValueSize, updateValueCallback) => {
    console.log('📡 订阅湿度更新');
    const interval = setInterval(() => {
      updateSensorData();
      updateValueCallback(formatHumidity(humidity));
    }, 2000);

    this._interval2 = interval;
  },
  onUnsubscribe: () => {
    console.log('❌ 取消订阅湿度');
    if (this._interval2) {
      clearInterval(this._interval2);
    }
  }
});

// 主服务
const tempHumidityService = new bleno.PrimaryService({
  uuid: TEMP_HUMIDITY_SERVICE_UUID,
  characteristics: [
    temperatureCharacteristic,
    humidityCharacteristic
  ]
});

// BLE 事件处理
bleno.on('stateChange', (state) => {
  console.log(`🔵 蓝牙状态: ${state}`);

  if (state === 'poweredOn') {
    console.log('🚀 开始广播: "TempHumiditySensor"');
    bleno.startAdvertising('TempHumiditySensor', [TEMP_HUMIDITY_SERVICE_UUID]);
  } else {
    console.log('⏹️  停止广播');
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', (error) => {
  if (error) {
    console.error('❌ 广播失败:', error);
  } else {
    console.log('✅ 广播成功!');
    console.log('📋 服务 UUID:', TEMP_HUMIDITY_SERVICE_UUID);
    console.log('🌡️  温度特征值:', TEMPERATURE_CHAR_UUID);
    console.log('💧 湿度特征值:', HUMIDITY_CHAR_UUID);
    console.log('');
    console.log('📱 现在可以用 iPhone App 连接了!');
    console.log('   设备名: TempHumiditySensor');
  }
});

bleno.on('accept', (clientAddress) => {
  console.log(`🔗 设备已连接: ${clientAddress}`);
});

bleno.on('disconnect', (clientAddress) => {
  console.log(`❌ 设备已断开: ${clientAddress}`);
});

// 定时更新数据（即使没有订阅）
setInterval(() => {
  updateSensorData();
  console.log(`📊 当前数据: 温度 ${temperature.toFixed(1)}°C, 湿度 ${humidity.toFixed(1)}%`);
}, 5000);

console.log('🌡️  BLE 温湿度传感器模拟器');
console.log('================================');
console.log('等待蓝牙启动...');
