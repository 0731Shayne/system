"use client";

import { CSSProperties, KeyboardEvent, useMemo, useState } from "react";

type Product = {
  id: string;
  category: string;
  description: string;
};

type DiagramNode = {
  id: string;
  title: string;
  items: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  columns?: number;
  products?: string[];
  passive?: boolean;
  load?: boolean;
};

type Diagram = {
  id: string;
  name: string;
  source: string;
  nodes: DiagramNode[];
  paths: string[];
};

const product = (id: string, category: string, description: string): Product => ({ id, category, description });

const PRODUCTS: Record<string, Product> = {
  LMP93601: product("LMP93601", "传感器信号调节器", "面向热电堆传感器的低噪声三通道模拟前端。"),
  OPT3004: product("OPT3004", "数字环境光传感器", "具有增强红外抑制能力的数字环境光传感器。"),
  IWRL6432AOP: product("IWRL6432AOP", "毫米波雷达传感器", "集成天线的低功耗 57GHz 至 63.5GHz 雷达传感器。"),
  HDC3021: product("HDC3021", "湿度传感器", "高精度数字湿度和温度传感器。"),
  TMP103: product("TMP103", "数字温度传感器", "支持低压供电和 I²C 接口的小型温度传感器。"),
  OPT3101: product("OPT3101", "接近传感器 AFE", "基于 ToF 的远距离接近和距离传感模拟前端。"),
  TMUX4051: product("TMUX4051", "模拟多路复用器", "8:1 单通道模拟多路复用器，兼容 1.8V 逻辑。"),
  OPA2320: product("OPA2320", "精密运算放大器", "双通道、20MHz、低偏置电流精密运算放大器。"),
  REF1933: product("REF1933", "电压基准", "具有 VREF 与 VREF/2 双输出的 3.3V 电压基准。"),
  MSPM0G1506: product("MSPM0G1506", "通用 MCU", "80MHz Cortex-M0+ MCU，集成双 ADC、DAC 和模拟外设。"),
  TMS320F2800132: product("TMS320F2800132", "C2000™ 实时 MCU", "具有六路 PWM 的 100MHz 实时控制 MCU。"),
  LM5021: product("LM5021", "交流/直流控制器", "30V、1MHz 电流模式 PWM 控制器。"),
  UCC28881: product("UCC28881", "离线电源开关", "700V、极低静态电流离线开关。"),
  UCC28910: product("UCC28910", "反激式开关", "带初级侧调节的 700V 恒压恒流反激式开关。"),
  TPS1641: product("TPS1641", "电子保险丝", "2.7V 至 40V、带输出功率限制的电子保险丝。"),
  TPS2595: product("TPS2595", "电子保险丝", "2.7V 至 18V、带过压保护的低阻电子保险丝。"),
  TPS542021: product("TPS542021", "同步降压转换器", "4.5V 至 30V 输入、2A 同步降压转换器。"),
  TPS65023B: product("TPS65023B", "多通道 PMIC", "集成三个 DC/DC、三个 LDO 和 I²C 接口的 PMIC。"),
  TLV709: product("TLV709", "低压降稳压器", "30V 输入、低静态电流 150mA LDO。"),
  TPS61165: product("TPS61165", "背光 LED 驱动器", "高亮度白光 LED 升压驱动器。"),
  LP5018: product("LP5018", "RGB LED 驱动器", "18 通道 I²C 恒流 RGB LED 驱动器。"),
  TPS65105: product("TPS65105", "LCD 偏置电源", "集成升压、电荷泵和 LDO 控制器的 LCD 偏置电源。"),
  TLV803E: product("TLV803E", "电压监控器", "低功耗、低电平有效开漏输出电压监控器。"),
  TPS3700: product("TPS3700", "窗口电压检测器", "用于过压和欠压监测的 18V 窗口检测器。"),
  SN65HVD3082E: product("SN65HVD3082E", "RS-485 收发器", "面向工业总线的半双工 RS-485 收发器。"),
  TPD2E001: product("TPD2E001", "ESD 保护", "双通道、低电容 ESD 保护二极管。"),
  TCA9535: product("TCA9535", "I²C I/O 扩展器", "具有中断和配置寄存器的 16 位 I/O 扩展器。"),
  CC3351MOD: product("CC3351MOD", "Wi-Fi 6 与蓝牙模块", "双频 Wi-Fi 6 与低功耗蓝牙配套模块。"),
  CC2340R2: product("CC2340R2", "2.4GHz 无线 MCU", "低待机功耗的蓝牙、Zigbee 和 Thread 无线 MCU。"),
  MSP430FR2633: product("MSP430FR2633", "电容式触控 MCU", "支持最多 64 个传感器的 CapTIvate™ 触控 MCU。"),
  LDC1614: product("LDC1614", "电感数字转换器", "四通道、28 位高分辨率电感数字转换器。"),
  DRV2605L: product("DRV2605L", "触觉驱动器", "集成波形库与自动谐振跟踪的 ERM/LRA 驱动器。"),
  DRV8421: product("DRV8421", "步进电机驱动器", "18V、2A 双通道 H 桥电机驱动器。"),
  DRV110: product("DRV110", "电磁阀驱动器", "集成电流调节的单通道继电器低侧驱动器。"),
  TPL7407L: product("TPL7407L", "低侧开关", "40V、七通道 NMOS 阵列低侧驱动器。"),
  UCC27624: product("UCC27624", "低侧栅极驱动器", "30V、5A 双通道低侧栅极驱动器。"),
  INA240: product("INA240", "电流检测放大器", "具备增强 PWM 抑制的双向精密电流检测放大器。"),
  DRV5013: product("DRV5013", "霍尔效应锁存器", "38V、高带宽霍尔效应锁存器。"),
  INA2180: product("INA2180", "电流检测放大器", "26V、双通道 350kHz 电流检测放大器。"),
  LM2903B: product("LM2903B", "比较器", "工业级双通道标准比较器。"),
  OPA320: product("OPA320", "精密运算放大器", "20MHz、低偏置电流、RRIO 精密运算放大器。"),
  FDC1004: product("FDC1004", "电容数字转换器", "带有源屏蔽驱动的四通道 16 位电容数字转换器。"),
  FDC2214: product("FDC2214", "电容数字转换器", "四通道、28 位电容数字转换器。"),
  INA180: product("INA180", "电流检测放大器", "26V、350kHz 模拟电流检测放大器。"),
  OPA2376: product("OPA2376", "精密运算放大器", "双通道、低噪声、低静态电流精密运算放大器。"),
  REF1930: product("REF1930", "电压基准", "具有 VREF 与 VREF/2 双输出的 3V 电压基准。"),
  MSPM0G1519: product("MSPM0G1519", "通用 MCU", "80MHz Cortex-M0+ MCU，具有双 ADC、DAC 和大容量存储器。"),
  MSPM0C1104: product("MSPM0C1104", "通用 MCU", "紧凑型 24MHz Cortex-M0+ MCU。"),
  TLV803: product("TLV803", "电压监控器", "三引脚、低电平有效开漏复位监控器。"),
  MAX3232E: product("MAX3232E", "RS-232 收发器", "带 ±15kV ESD 保护的双通道 RS-232 收发器。"),
  CC3200MOD: product("CC3200MOD", "Wi-Fi 模块", "SimpleLink™ Wi-Fi 与物联网无线模块。"),
  DRV8304: product("DRV8304", "三相栅极驱动器", "40V 三相智能栅极驱动器，集成电流分流放大器。"),
  DRV8215: product("DRV8215", "有刷电机驱动器", "11V、4A 半桥电机驱动器，支持无传感器堵转检测。"),
  DRV8234: product("DRV8234", "有刷电机驱动器", "38V、2A H 桥电机驱动器，支持纹波计数。"),
  DRV8424: product("DRV8424", "步进电机驱动器", "35V、2.5A 双极步进电机驱动器。"),
  UCC27735: product("UCC27735", "半桥栅极驱动器", "700V、4A 半桥栅极驱动器。"),
  DRV5023: product("DRV5023", "霍尔效应开关", "38V、高带宽单极霍尔效应开关。"),
  INA181: product("INA181", "电流检测放大器", "26V、双向 350kHz 电流检测放大器。"),
  LM393A: product("LM393A", "比较器", "工业级精密双通道差分比较器。"),
  REF1925: product("REF1925", "电压基准", "具有 VREF 与 VREF/2 双输出的 2.5V 电压基准。"),
};

const AIR_NODES: DiagramNode[] = [
  { id: "ac", title: "AC input", items: ["220 VAC"], x: 18, y: 34, width: 86, height: 66, passive: true },
  { id: "input-protection", title: "Input power protection", items: ["Fuse", "Varistor", "Inrush current protection", "EMI protection"], x: 132, y: 22, width: 190, height: 116, columns: 2, passive: true },
  { id: "acdc", title: "AC/DC power supply", items: ["Diode bridge rectifier", "PWM controller", "Isolated flyback", "Voltage feedback"], x: 365, y: 22, width: 190, height: 116, columns: 2, products: ["LM5021", "UCC28881", "UCC28910"] },
  { id: "gating", title: "Power protection & gating", items: ["E-fuse & protection", "Load switch"], x: 600, y: 30, width: 148, height: 100, products: ["TPS1641", "TPS2595"] },
  { id: "rails", title: "Non-isolated DC/DC power supply", items: ["DC/DC", "Multi-channel PMIC", "LDO"], x: 792, y: 22, width: 160, height: 116, products: ["TPS542021", "TPS65023B", "TLV709"] },
  { id: "sensors", title: "Sensors", items: ["Temperature sensors", "Humidity sensors", "Air quality sensors", "Ambient light sensors", "Proximity sensors", "Human activity sensors", "3D ToF", "Infrared sensors"], x: 25, y: 210, width: 178, height: 254, products: ["LMP93601", "OPT3004", "IWRL6432AOP", "HDC3021", "TMP103", "OPT3101"] },
  { id: "afe", title: "Analog front-end", items: ["MUX", "AMP", "ADC", "REF"], x: 258, y: 257, width: 166, height: 126, columns: 2, products: ["LMP93601", "TMUX4051", "OPA2320", "REF1933"] },
  { id: "mcu", title: "Digital processing", items: ["MCU", "Memory", "Real-time control"], x: 480, y: 246, width: 166, height: 140, products: ["MSPM0G1506", "TMS320F2800132"] },
  { id: "display", title: "Output user interface", items: ["LED / TFT LCD display", "Backlight LED driver", "Level shifter", "Audio output"], x: 713, y: 202, width: 214, height: 158, columns: 2, products: ["TPS61165", "LP5018", "TPS65105"] },
  { id: "loads", title: "Output loads", items: ["Display", "Speaker", "Buzzer", "Auxiliary heater"], x: 950, y: 202, width: 150, height: 158, passive: true, load: true },
  { id: "monitor", title: "Monitoring", items: ["Watchdog", "Temperature", "Reset", "Voltage supervisor"], x: 480, y: 438, width: 166, height: 136, products: ["TLV803E", "TPS3700"] },
  { id: "wired", title: "Wired interface", items: ["RS-485", "CAN", "UART", "HomeBus", "Isolation", "Protection"], x: 25, y: 516, width: 202, height: 194, columns: 2, products: ["SN65HVD3082E", "TPD2E001", "TCA9535"] },
  { id: "wireless", title: "Wireless interface", items: ["Wi-Fi 6", "Bluetooth LE", "2.4GHz RF"], x: 274, y: 578, width: 168, height: 124, products: ["CC3351MOD", "CC2340R2"] },
  { id: "input-ui", title: "Input user interface", items: ["Gesture recognition", "Touch keys", "Dial", "Inductive / capacitive sensing"], x: 480, y: 624, width: 196, height: 136, columns: 2, products: ["MSP430FR2633", "LDC1614", "DRV2605L"] },
  { id: "power-stage", title: "Power stage", items: ["Relay driver", "Triacs", "Gate driver", "MOSFETs / IGBTs"], x: 724, y: 414, width: 198, height: 162, columns: 2, products: ["DRV8421", "DRV110", "TPL7407L", "UCC27624"] },
  { id: "motor-drive", title: "Motor drive", items: ["Step motor driver", "BDC motor driver", "BLDC motor driver", "Hall sensor"], x: 724, y: 620, width: 198, height: 140, columns: 2, products: ["DRV8421", "INA240", "DRV5013"] },
  { id: "actuators", title: "Actuators", items: ["Horizontal louver motor", "Vertical louver motor", "Cross-flow fan motor", "BLDC fan motor"], x: 950, y: 596, width: 150, height: 164, passive: true, load: true },
  { id: "sense", title: "Current & voltage sense", items: ["Current sense", "Voltage sense", "Comparator", "Reference"], x: 724, y: 790, width: 198, height: 132, columns: 2, products: ["INA2180", "LM2903B", "OPA320"] },
];

const COFFEE_NODES: DiagramNode[] = [
  { id: "ac", title: "AC input", items: ["220 VAC"], x: 18, y: 34, width: 86, height: 66, passive: true },
  { id: "input-protection", title: "Input power protection", items: ["Fuse", "Varistor", "Inrush current protection", "EMI protection"], x: 132, y: 22, width: 190, height: 116, columns: 2, passive: true },
  { id: "acdc", title: "Isolated AC/DC power supply", items: ["Diode bridge rectifier", "PWM controller", "Isolated flyback", "Synchronous rectifier"], x: 365, y: 22, width: 190, height: 116, columns: 2, products: ["UCC28881", "UCC28910", "LM5021"] },
  { id: "gating", title: "Power protection & gating", items: ["E-fuse & protection", "Load switch"], x: 600, y: 30, width: 148, height: 100, products: ["TPS2595", "TPS1641"] },
  { id: "rails", title: "Non-isolated DC/DC power supply", items: ["DC/DC", "LDO", "Analog supply"], x: 792, y: 22, width: 160, height: 116, products: ["TPS542021", "TPS65023B", "TLV709"] },
  { id: "sensors", title: "Sensors", items: ["Water level", "Temperature", "Cup proximity", "Lid position", "Flow", "Pressure"], x: 25, y: 214, width: 178, height: 198, columns: 2, products: ["DRV5013", "OPT3101", "FDC1004"] },
  { id: "afe", title: "Analog front-end", items: ["MUX", "AMP", "ADC", "Comparator"], x: 258, y: 246, width: 166, height: 126, columns: 2, products: ["INA180", "OPA2376", "REF1930"] },
  { id: "mcu", title: "Digital processing", items: ["MCU / MPU", "Sequence control", "Fault management"], x: 480, y: 236, width: 166, height: 140, products: ["MSPM0G1519", "MSPM0C1104"] },
  { id: "power-stage", title: "Power stage", items: ["Pump motor driver", "Milk frother motor driver", "Grinder motor driver", "Valve driver", "Heater driver", "Relay driver"], x: 735, y: 196, width: 220, height: 236, columns: 2, products: ["DRV8304", "DRV8215", "DRV8234", "DRV110", "DRV8424", "UCC27735"] },
  { id: "loads", title: "Loads", items: ["Pump motor", "Milk frother motor", "Grinder motor", "Solenoid valves", "Water heater", "Buzzer"], x: 970, y: 196, width: 140, height: 236, passive: true, load: true },
  { id: "monitor", title: "Monitoring", items: ["Watchdog", "Undervoltage reset", "Overtemperature protection"], x: 480, y: 430, width: 166, height: 124, products: ["TLV803", "TPS3700"] },
  { id: "wired", title: "Wired interface", items: ["UART", "I²C", "SPI", "Protection"], x: 25, y: 470, width: 178, height: 146, columns: 2, products: ["TCA9535", "MAX3232E", "TPD2E001"] },
  { id: "wireless", title: "Wireless interface", items: ["Wi-Fi", "Bluetooth LE"], x: 25, y: 662, width: 178, height: 104, products: ["CC3200MOD", "CC2340R2"] },
  { id: "input-ui", title: "Input user interface", items: ["Capacitive touch", "Speed knob", "Touch keys", "Haptics driver"], x: 258, y: 470, width: 184, height: 146, columns: 2, products: ["MSP430FR2633", "FDC2214", "DRV2605L"] },
  { id: "output-ui", title: "Output user interface", items: ["LED / TFT LCD display", "Backlight LED driver", "RGB indicator", "Audio output"], x: 258, y: 662, width: 184, height: 132, columns: 2, products: ["TPS61165", "LP5018", "TPS65105"] },
  { id: "position", title: "Position sensor", items: ["Magnetic sensing", "Hall sensor", "Stall detection"], x: 735, y: 488, width: 220, height: 124, products: ["DRV5013", "DRV5023", "DRV8215"] },
  { id: "sense", title: "Current & voltage sense", items: ["Current sense", "Voltage sense", "Comparator", "Voltage reference"], x: 735, y: 666, width: 220, height: 132, columns: 2, products: ["INA181", "LM393A", "REF1925"] },
];

const diagrams: Diagram[] = [
  {
    id: "air-indoor",
    name: "空调室内机",
    source: "https://www.ti.com.cn/solution/cn/air-conditioner-indoor-unit?variantid=34874&subsystemid=16093",
    nodes: AIR_NODES,
    paths: [
      "M104 67H132", "M322 67H365", "M555 67H600", "M748 67H792",
      "M203 335H258", "M424 320H480", "M646 310H713", "M927 280H950",
      "M563 386V438", "M563 438V400H820V414", "M646 316H680V495H724",
      "M227 613H250V316H258", "M442 640H460V316H480", "M676 692H695V535H724",
      "M922 495H950", "M922 690H950", "M823 620V576", "M823 790V760",
      "M875 138V175H563V246", "M845 138V184H820V202", "M872 360V414",
    ],
  },
  {
    id: "coffee-machine",
    name: "咖啡机",
    source: "https://www.ti.com/solution/coffee-machine",
    nodes: COFFEE_NODES,
    paths: [
      "M104 67H132", "M322 67H365", "M555 67H600", "M748 67H792",
      "M203 313H258", "M424 309H480", "M646 306H735", "M955 314H970",
      "M563 376V430", "M646 306H690V314H735", "M203 543H235V309H258",
      "M203 714H224V543H258", "M442 543H462V306H480", "M442 728H462V306H480",
      "M646 306H690V550H735", "M845 488V432", "M845 666V612", "M872 138V168H563V236",
    ],
  },
];

function wrapLabel(label: string, limit: number) {
  if (label.length <= limit) return [label];
  const words = label.split(/\s+/);
  if (words.length === 1) {
    const midpoint = Math.ceil(label.length / 2);
    return [label.slice(0, midpoint), label.slice(midpoint)];
  }
  const lines: string[] = [];
  for (const word of words) {
    const current = lines.at(-1);
    if (!current || `${current} ${word}`.length > limit) lines.push(word);
    else lines[lines.length - 1] = `${current} ${word}`;
  }
  if (lines.length <= 3) return lines;
  return [lines[0], lines[1], lines.slice(2).join(" ")];
}

function loadSymbol(label: string) {
  if (/motor|fan/i.test(label)) return "M";
  if (/heater/i.test(label)) return "H";
  if (/speaker/i.test(label)) return "S";
  if (/buzzer/i.test(label)) return "B";
  if (/display/i.test(label)) return "D";
  return "V";
}

function SystemDiagram({ diagram, selectedId, onSelect }: { diagram: Diagram; selectedId: string; onSelect: (id: string) => void }) {
  return (
    <svg id="system-diagram" className="system-svg" viewBox="0 0 1120 950" role="img" aria-label={`${diagram.name}完整工程系统框图`}>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#23292d" /></marker>
      </defs>
      <rect width="1120" height="950" fill="#fff" />
      <g className="svg-links">{diagram.paths.map((path, index) => <path key={index} d={path} markerEnd="url(#arrow)" />)}</g>
      <g>
        {diagram.nodes.map((node) => {
          const clickable = Boolean(node.products?.length);
          const active = node.id === selectedId;
          const columns = node.columns ?? 1;
          const gap = 5;
          const pad = 9;
          const rows = Math.ceil(node.items.length / columns);
          const titleLines = wrapLabel(node.title, Math.max(12, Math.floor((node.width - 10) / 6)));
          const availableHeight = node.height - (titleLines.length > 1 ? 44 : 33);
          const itemHeight = Math.max(19, (availableHeight - gap * (rows - 1)) / rows);
          const itemWidth = (node.width - pad * 2 - gap * (columns - 1)) / columns;
          const className = ["svg-node", clickable && "is-clickable", active && "is-selected", node.passive && "is-passive", node.load && "is-load"].filter(Boolean).join(" ");
          const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
            if (clickable && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onSelect(node.id); }
          };
          if (node.load) {
            const loadHeight = (node.height - 22) / node.items.length;
            return (
              <g key={node.id} className={className}>
                {node.items.map((label, index) => {
                  const centerY = node.y + index * loadHeight + loadHeight / 2;
                  const lines = wrapLabel(label, 15);
                  return (
                    <g key={label} className="load-item">
                      <circle cx={node.x + 17} cy={centerY} r="14" />
                      <text className="load-symbol" x={node.x + 17} y={centerY + 5} textAnchor="middle">{loadSymbol(label)}</text>
                      <text className="load-label" x={node.x + 38} y={centerY - (lines.length - 1) * 5 + 4}>
                        {lines.map((line, lineIndex) => <tspan key={lineIndex} x={node.x + 38} dy={lineIndex ? 11 : 0}>{line}</tspan>)}
                      </text>
                    </g>
                  );
                })}
                <text className="node-title load-title" x={node.x + node.width / 2} y={node.y + node.height} textAnchor="middle">{node.title}</text>
              </g>
            );
          }
          return (
            <g key={node.id} className={className} role={clickable ? "button" : undefined} tabIndex={clickable ? 0 : undefined} aria-label={clickable ? `查看${node.title}的 TI 产品` : undefined} onClick={() => clickable && onSelect(node.id)} onKeyDown={onKeyDown}>
              <rect className="node-shell" x={node.x} y={node.y} width={node.width} height={node.height} rx="1" />
              {active && <rect className="selection-outline" x={node.x - 5} y={node.y - 5} width={node.width + 10} height={node.height + 10} />}
              {node.items.map((label, index) => {
                const col = index % columns;
                const row = Math.floor(index / columns);
                const x = node.x + pad + col * (itemWidth + gap);
                const y = node.y + pad + row * (itemHeight + gap);
                const lines = wrapLabel(label, Math.max(9, Math.floor(itemWidth / 5.7)));
                return (
                  <g key={label}>
                    <rect className="function-chip" x={x} y={y} width={itemWidth} height={itemHeight} rx="1" />
                    <text className={`function-label${lines.length === 3 ? " compact" : ""}`} x={x + itemWidth / 2} y={y + itemHeight / 2 - (lines.length - 1) * 5.5 + 3.5} textAnchor="middle">
                      {lines.map((line, lineIndex) => <tspan key={lineIndex} x={x + itemWidth / 2} dy={lineIndex ? 12 : 0}>{line}</tspan>)}
                    </text>
                  </g>
                );
              })}
              <text className="node-title" x={node.x + node.width / 2} y={node.y + node.height - 9 - (titleLines.length - 1) * 5.5} textAnchor="middle">
                {titleLines.map((line, lineIndex) => <tspan key={lineIndex} x={node.x + node.width / 2} dy={lineIndex ? 11 : 0}>{line}</tspan>)}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export default function Home() {
  const [diagramId, setDiagramId] = useState(diagrams[0].id);
  const diagram = useMemo(() => diagrams.find((item) => item.id === diagramId) ?? diagrams[0], [diagramId]);
  const [selectedByDiagram, setSelectedByDiagram] = useState<Record<string, string>>({ "air-indoor": "sensors", "coffee-machine": "power-stage" });
  const [zoom, setZoom] = useState(1);
  const selectedId = selectedByDiagram[diagram.id] ?? diagram.nodes.find((node) => node.products?.length)?.id ?? "";
  const selected = diagram.nodes.find((node) => node.id === selectedId) ?? diagram.nodes[0];
  const products = (selected.products ?? []).map((id) => PRODUCTS[id]).filter(Boolean);

  function chooseDiagram(next: Diagram) { setDiagramId(next.id); setZoom(1); }
  function chooseNode(id: string) { setSelectedByDiagram((current) => ({ ...current, [diagram.id]: id })); }
  function downloadSvg() {
    const source = document.getElementById("system-diagram");
    if (!source) return;
    const clone = source.cloneNode(true) as SVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${diagram.id}.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>交互式系统框图</h1>
        <nav aria-label="选择系统">
          {diagrams.map((item) => <button key={item.id} type="button" className={item.id === diagram.id ? "active" : ""} onClick={() => chooseDiagram(item)}>{item.name}</button>)}
        </nav>
      </header>

      <section className="workspace" style={{ "--zoom": zoom } as CSSProperties}>
        <section className="diagram-pane">
          <div className="diagram-head">
            <h2>{diagram.name}</h2>
            <div className="diagram-actions">
              <button type="button" onClick={downloadSvg}>下载 SVG</button>
              <button type="button" aria-label="缩小" onClick={() => setZoom((value) => Math.max(.8, +(value - .1).toFixed(1)))}>−</button>
              <output>{Math.round(zoom * 100)}%</output>
              <button type="button" aria-label="放大" onClick={() => setZoom((value) => Math.min(1.25, +(value + .1).toFixed(1)))}>＋</button>
            </div>
          </div>
          <div className="svg-scroller"><div className="svg-scale"><SystemDiagram diagram={diagram} selectedId={selectedId} onSelect={chooseNode} /></div></div>
        </section>

        <aside className="product-pane" aria-live="polite">
          <header><h2>{selected.title}</h2><span>{products.length} 个推荐产品</span></header>
          <div className="product-list">
            {products.map((item) => (
              <article key={item.id}>
                <div><span>{item.category}</span><a href={`https://www.ti.com.cn/product/cn/${item.id}`} target="_blank" rel="noreferrer">TI 官网 ↗</a></div>
                <h3>{item.id}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <a className="source-link" href={diagram.source} target="_blank" rel="noreferrer">查看 TI 原始应用页面 ↗</a>
        </aside>
      </section>
    </main>
  );
}
