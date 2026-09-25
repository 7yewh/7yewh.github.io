export const skills = {
  zh: [
    { group: '硬件设计', items: ['原理图设计与评审', 'PCB 布局布线', '器件选型 / BOM', '模拟前端', '电源与 LDO / DCDC', '上板调试'] },
    { group: 'MCU 与固件', items: ['STM32 G0 / G4 / H7 / N6', 'Cortex-M 裸机', 'HAL / LL / 寄存器', 'DMA / 中断 / 低功耗', 'Bootloader / OTA', 'RTOS'] },
    { group: '通信与协议', items: ['CAN / CAN FD', 'I2C / SPI / UART', 'USB CDC', '自定义协议设计', '多设备组网'] },
    { group: '上位机与算法', items: ['Python / PyQt5', 'NumPy / SciPy', '滤波与状态估计', '传感器融合', '标定与最小二乘'] },
    { group: '端侧 AI', items: ['PyTorch', 'ONNX', 'INT8 量化', 'STM32Cube.AI', 'NPU 部署'] },
    { group: '工程化', items: ['CMake / Ninja', 'ARM GCC', 'Git', '自动化烧录与测试', '示波器 / 逻辑分析仪'] },
  ],
  en: [
    { group: 'Hardware design', items: ['Schematic design & review', 'PCB layout', 'Part selection / BOM', 'Analog front-end', 'Power: LDO / DCDC', 'Board bring-up'] },
    { group: 'MCU & firmware', items: ['STM32 G0 / G4 / H7 / N6', 'Bare-metal Cortex-M', 'HAL / LL / registers', 'DMA / interrupts / low power', 'Bootloader / OTA', 'RTOS'] },
    { group: 'Communication', items: ['CAN / CAN FD', 'I2C / SPI / UART', 'USB CDC', 'Custom protocol design', 'Multi-device networking'] },
    { group: 'Host & algorithms', items: ['Python / PyQt5', 'NumPy / SciPy', 'Filtering & state estimation', 'Sensor fusion', 'Calibration & least squares'] },
    { group: 'On-device AI', items: ['PyTorch', 'ONNX', 'INT8 quantisation', 'STM32Cube.AI', 'NPU deployment'] },
    { group: 'Engineering', items: ['CMake / Ninja', 'ARM GCC', 'Git', 'Automated flash & test', 'Oscilloscope / logic analyzer'] },
  ],
};
