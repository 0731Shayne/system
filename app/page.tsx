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
  { id: "ac", title: "交流输入", items: ["AC 220V"], x: 18, y: 34, width: 86, height: 66, passive: true },
  { id: "input-protection", title: "输入电源保护", items: ["保险丝", "浪涌吸收", "浪涌电流限制", "EMI 滤波"], x: 132, y: 22, width: 190, height: 116, columns: 2, passive: true },
  { id: "acdc", title: "交流/直流电源", items: ["整流桥", "PWM 控制", "隔离反激", "电压反馈"], x: 365, y: 22, width: 190, height: 116, columns: 2, products: ["LM5021", "UCC28881", "UCC28910"] },
  { id: "gating", title: "电源保护与门控", items: ["电子保险丝", "负载开关"], x: 600, y: 30, width: 148, height: 100, products: ["TPS1641", "TPS2595"] },
  { id: "rails", title: "低压电源树", items: ["DC/DC", "多通道 PMIC", "LDO"], x: 792, y: 22, width: 160, height: 116, products: ["TPS542021", "TPS65023B", "TLV709"] },
  { id: "sensors", title: "环境与人体传感", items: ["温度", "湿度", "空气质量", "环境光", "接近", "人体存在", "3D ToF", "红外"], x: 25, y: 210, width: 178, height: 254, products: ["LMP93601", "OPT3004", "IWRL6432AOP", "HDC3021", "TMP103", "OPT3101"] },
  { id: "afe", title: "模拟前端", items: ["MUX", "AMP", "ADC", "REF"], x: 258, y: 257, width: 166, height: 126, columns: 2, products: ["LMP93601", "TMUX4051", "OPA2320", "REF1933"] },
  { id: "mcu", title: "数字处理", items: ["主控 MCU", "存储器", "实时控制"], x: 480, y: 246, width: 166, height: 140, products: ["MSPM0G1506", "TMS320F2800132"] },
  { id: "display", title: "显示与声音输出", items: ["LCD / LED", "背光驱动", "电平转换", "音频输出"], x: 713, y: 202, width: 214, height: 158, columns: 2, products: ["TPS61165", "LP5018", "TPS65105"] },
  { id: "loads", title: "输出负载", items: ["显示屏", "扬声器", "蜂鸣器", "辅助加热"], x: 966, y: 202, width: 118, height: 158, passive: true, load: true },
  { id: "monitor", title: "系统监测", items: ["看门狗", "温度保护", "复位", "电压监控"], x: 480, y: 438, width: 166, height: 136, products: ["TLV803E", "TPS3700"] },
  { id: "wired", title: "有线通信", items: ["RS-485", "CAN", "UART", "HomeBus", "隔离", "接口保护"], x: 25, y: 516, width: 202, height: 194, columns: 2, products: ["SN65HVD3082E", "TPD2E001", "TCA9535"] },
  { id: "wireless", title: "无线通信", items: ["Wi-Fi 6", "Bluetooth LE", "2.4GHz RF"], x: 274, y: 578, width: 168, height: 124, products: ["CC3351MOD", "CC2340R2"] },
  { id: "input-ui", title: "用户输入", items: ["手势识别", "触摸按键", "旋钮", "电容/电感感应"], x: 480, y: 624, width: 196, height: 136, columns: 2, products: ["MSP430FR2633", "LDC1614", "DRV2605L"] },
  { id: "power-stage", title: "继电器与功率级", items: ["继电器驱动", "Triac", "栅极驱动", "MOSFET / IGBT"], x: 724, y: 414, width: 198, height: 162, columns: 2, products: ["DRV8421", "DRV110", "TPL7407L", "UCC27624"] },
  { id: "motor-drive", title: "风机与风门驱动", items: ["步进驱动", "BDC 驱动", "BLDC 驱动", "霍尔反馈"], x: 724, y: 620, width: 198, height: 140, columns: 2, products: ["DRV8421", "INA240", "DRV5013"] },
  { id: "actuators", title: "执行器", items: ["横向摆叶 M", "纵向摆叶 M", "贯流风机 M", "无刷风机 M"], x: 966, y: 596, width: 118, height: 164, passive: true, load: true },
  { id: "sense", title: "电流与电压检测", items: ["电流采样", "电压采样", "比较器", "基准"], x: 724, y: 790, width: 198, height: 132, columns: 2, products: ["INA2180", "LM2903B", "OPA320"] },
];

const COFFEE_NODES: DiagramNode[] = [
  { id: "ac", title: "交流输入", items: ["AC 220V"], x: 18, y: 34, width: 86, height: 66, passive: true },
  { id: "input-protection", title: "输入电源保护", items: ["保险丝", "压敏电阻", "浪涌限制", "EMI 滤波"], x: 132, y: 22, width: 190, height: 116, columns: 2, passive: true },
  { id: "acdc", title: "辅助电源", items: ["整流桥", "PWM 控制", "隔离反激", "同步整流"], x: 365, y: 22, width: 190, height: 116, columns: 2, products: ["UCC28881", "UCC28910", "LM5021"] },
  { id: "gating", title: "电源保护与门控", items: ["电子保险丝", "负载开关"], x: 600, y: 30, width: 148, height: 100, products: ["TPS2595", "TPS1641"] },
  { id: "rails", title: "低压电源树", items: ["DC/DC", "LDO", "模拟电源"], x: 792, y: 22, width: 160, height: 116, products: ["TPS542021", "TPS65023B", "TLV709"] },
  { id: "sensors", title: "过程传感器", items: ["水位", "温度", "杯体接近", "上盖状态", "流量", "压力"], x: 25, y: 214, width: 178, height: 198, columns: 2, products: ["DRV5013", "OPT3101", "FDC1004"] },
  { id: "afe", title: "模拟前端", items: ["MUX", "AMP", "ADC", "比较器"], x: 258, y: 246, width: 166, height: 126, columns: 2, products: ["INA180", "OPA2376", "REF1930"] },
  { id: "mcu", title: "数字处理", items: ["主控 MCU", "时序控制", "故障管理"], x: 480, y: 236, width: 166, height: 140, products: ["MSPM0G1519", "MSPM0C1104"] },
  { id: "power-stage", title: "电机与负载功率级", items: ["泵电机驱动", "奶泡电机驱动", "磨豆电机驱动", "阀组驱动", "加热器驱动", "继电器驱动"], x: 735, y: 196, width: 220, height: 236, columns: 2, products: ["DRV8304", "DRV8215", "DRV8234", "DRV110", "DRV8424", "UCC27735"] },
  { id: "loads", title: "执行负载", items: ["水泵 M", "奶泡器 M", "磨豆机 M", "电磁阀", "加热盘", "蜂鸣器"], x: 990, y: 196, width: 110, height: 236, passive: true, load: true },
  { id: "monitor", title: "系统监测", items: ["看门狗", "欠压复位", "过温保护"], x: 480, y: 430, width: 166, height: 124, products: ["TLV803", "TPS3700"] },
  { id: "wired", title: "有线接口", items: ["UART", "I²C", "SPI", "接口保护"], x: 25, y: 470, width: 178, height: 146, columns: 2, products: ["TCA9535", "MAX3232E", "TPD2E001"] },
  { id: "wireless", title: "无线连接", items: ["Wi-Fi", "Bluetooth LE"], x: 25, y: 662, width: 178, height: 104, products: ["CC3200MOD", "CC2340R2"] },
  { id: "input-ui", title: "用户输入", items: ["电容触摸", "旋钮", "按键", "触觉反馈"], x: 258, y: 470, width: 184, height: 146, columns: 2, products: ["MSP430FR2633", "FDC2214", "DRV2605L"] },
  { id: "output-ui", title: "显示与声音输出", items: ["LCD / LED", "背光驱动", "RGB 指示", "音频输出"], x: 258, y: 662, width: 184, height: 132, columns: 2, products: ["TPS61165", "LP5018", "TPS65105"] },
  { id: "position", title: "位置与转速反馈", items: ["磁性检测", "霍尔开关", "堵转检测"], x: 735, y: 488, width: 220, height: 124, products: ["DRV5013", "DRV5023", "DRV8215"] },
  { id: "sense", title: "电流与电压检测", items: ["电流采样", "电压采样", "比较器", "电压基准"], x: 735, y: 666, width: 220, height: 132, columns: 2, products: ["INA181", "LM393A", "REF1925"] },
];

const diagrams: Diagram[] = [
  {
    id: "air-indoor",
    name: "空调室内机",
    source: "https://www.ti.com.cn/solution/cn/air-conditioner-indoor-unit?variantid=34874&subsystemid=16093",
    nodes: AIR_NODES,
    paths: [
      "M104 67H132", "M322 67H365", "M555 67H600", "M748 67H792",
      "M203 335H258", "M424 320H480", "M646 310H713", "M927 280H966",
      "M563 386V438", "M563 438V400H820V414", "M646 316H680V495H724",
      "M227 613H250V316H258", "M442 640H460V316H480", "M676 692H695V535H724",
      "M922 495H966", "M922 690H966", "M823 620V576", "M823 790V760",
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
      "M203 313H258", "M424 309H480", "M646 306H735", "M955 314H990",
      "M563 376V430", "M646 306H690V314H735", "M203 543H235V309H258",
      "M203 714H224V543H258", "M442 543H462V306H480", "M442 728H462V306H480",
      "M646 306H690V550H735", "M845 488V432", "M845 666V612", "M872 138V168H563V236",
    ],
  },
];

function wrapLabel(label: string, limit: number) {
  if (label.length <= limit) return [label];
  const divider = label.includes(" ") ? label.lastIndexOf(" ", limit) : Math.ceil(label.length / 2);
  const point = divider > 2 ? divider : Math.ceil(label.length / 2);
  return [label.slice(0, point).trim(), label.slice(point).trim()];
}

function SystemDiagram({ diagram, selectedId, onSelect }: { diagram: Diagram; selectedId: string; onSelect: (id: string) => void }) {
  return (
    <svg id="system-diagram" className="system-svg" viewBox="0 0 1120 950" role="img" aria-label={`${diagram.name}完整工程系统框图`}>
      <defs>
        <pattern id="dot-grid" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#dce5e7" /></pattern>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#23292d" /></marker>
      </defs>
      <rect width="1120" height="950" fill="#fff" />
      <rect width="1120" height="950" fill="url(#dot-grid)" opacity=".35" />
      <g className="svg-links">{diagram.paths.map((path, index) => <path key={index} d={path} markerEnd="url(#arrow)" />)}</g>
      <g>
        {diagram.nodes.map((node) => {
          const clickable = Boolean(node.products?.length);
          const active = node.id === selectedId;
          const columns = node.columns ?? 1;
          const gap = 5;
          const pad = 9;
          const rows = Math.ceil(node.items.length / columns);
          const availableHeight = node.height - 35;
          const itemHeight = Math.max(19, (availableHeight - gap * (rows - 1)) / rows);
          const itemWidth = (node.width - pad * 2 - gap * (columns - 1)) / columns;
          const className = ["svg-node", clickable && "is-clickable", active && "is-selected", node.passive && "is-passive", node.load && "is-load"].filter(Boolean).join(" ");
          const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
            if (clickable && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onSelect(node.id); }
          };
          return (
            <g key={node.id} className={className} role={clickable ? "button" : undefined} tabIndex={clickable ? 0 : undefined} aria-label={clickable ? `查看${node.title}的 TI 产品` : undefined} onClick={() => clickable && onSelect(node.id)} onKeyDown={onKeyDown}>
              <rect className="node-shell" x={node.x} y={node.y} width={node.width} height={node.height} rx="1" />
              <rect className="node-accent" x={node.x} y={node.y} width="4" height={node.height} />
              {node.items.map((label, index) => {
                const col = index % columns;
                const row = Math.floor(index / columns);
                const x = node.x + pad + col * (itemWidth + gap);
                const y = node.y + pad + row * (itemHeight + gap);
                const lines = wrapLabel(label, itemWidth < 75 ? 7 : 11);
                return (
                  <g key={label}>
                    <rect className="function-chip" x={x} y={y} width={itemWidth} height={itemHeight} rx="1" />
                    <text className="function-label" x={x + itemWidth / 2} y={y + itemHeight / 2 - (lines.length - 1) * 6 + 4} textAnchor="middle">
                      {lines.map((line, lineIndex) => <tspan key={lineIndex} x={x + itemWidth / 2} dy={lineIndex ? 12 : 0}>{line}</tspan>)}
                    </text>
                  </g>
                );
              })}
              <text className="node-title" x={node.x + node.width / 2} y={node.y + node.height - 9} textAnchor="middle">{node.title}</text>
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
