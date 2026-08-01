"use client";

import { CSSProperties, KeyboardEvent, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
};

type DiagramNode = {
  id: string;
  title: string;
  functions: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  products?: string[];
  passive?: boolean;
};

type Diagram = {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  description: string;
  nodes: DiagramNode[];
  links: Array<[string, string]>;
};

const ti = (id: string, name: string, category: string, description: string): Product => ({
  id,
  name,
  category,
  description,
  url: `https://www.ti.com/product/${id}`,
});

const PRODUCTS: Record<string, Product> = {
  UCC21520: ti("UCC21520", "UCC21520", "隔离式栅极驱动器", "增强型隔离双通道栅极驱动器，适合半桥功率级。"),
  UCC21750: ti("UCC21750", "UCC21750", "隔离式栅极驱动器", "带集成保护与传感功能的单通道隔离式栅极驱动器。"),
  ISO7741: ti("ISO7741", "ISO7741", "数字隔离器", "四通道增强型数字隔离器，用于控制域与高压域信号隔离。"),
  ISO7762: ti("ISO7762", "ISO7762", "数字隔离器", "六通道增强型数字隔离器，适合多路 PWM 和状态信号。"),
  AMC1300: ti("AMC1300", "AMC1300", "隔离式放大器", "增强型隔离精密放大器，用于分流电阻电流检测。"),
  INA240: ti("INA240", "INA240", "电流检测放大器", "支持宽共模范围的双向电流检测放大器。"),
  TMCS1100: ti("TMCS1100", "TMCS1100", "霍尔效应电流传感器", "集成霍尔效应隔离的电流检测器件。"),
  F280039C: ti("TMS320F280039C", "TMS320F280039C", "C2000™ 实时 MCU", "面向数字电源与电机控制的 C2000 实时微控制器。"),
  F280049C: ti("TMS320F280049C", "TMS320F280049C", "C2000™ 实时 MCU", "集成控制加速功能的 C2000 实时微控制器。"),
  F28379D: ti("TMS320F28379D", "TMS320F28379D", "C2000™ 双核实时 MCU", "适合多轴工业控制和高性能电力电子控制。"),
  ISO1042: ti("ISO1042", "ISO1042", "隔离式 CAN 收发器", "增强型隔离 CAN 收发器，用于高压系统通信接口。"),
  ISO1410: ti("ISO1410", "ISO1410", "隔离式 RS-485 收发器", "增强型隔离 RS-485/RS-422 收发器。"),
  THVD1450: ti("THVD1450", "THVD1450", "RS-485 收发器", "面向工业通信的半双工 RS-485 收发器。"),
  TCAN1042H: ti("TCAN1042H", "TCAN1042H", "CAN 收发器", "具有故障保护能力的高速 CAN 收发器。"),
  TPS54202: ti("TPS54202", "TPS54202", "降压转换器", "适合低压控制与接口电源轨的同步降压转换器。"),
  LM5164: ti("LM5164", "LM5164", "宽输入降压转换器", "面向高压辅助电源的宽输入同步降压转换器。"),
  UCC28740: ti("UCC28740", "UCC28740", "反激控制器", "用于隔离式辅助电源的反激控制器。"),
  UCC28180: ti("UCC28180", "UCC28180", "PFC 控制器", "连续导通模式升压功率因数校正控制器。"),
  UCC28070: ti("UCC28070", "UCC28070", "交错式 PFC 控制器", "双相交错式功率因数校正控制器。"),
  BQ79616: ti("BQ79616", "BQ79616", "电池监测器与均衡器", "面向高压电池堆的 16 节串联电池监测与均衡器。"),
  BQ76952: ti("BQ76952", "BQ76952", "电池监测器与保护器", "面向多节串联电池组的高度集成监测和保护器件。"),
  BQ79600Q1: ti("BQ79600-Q1", "BQ79600-Q1", "电池通信桥接器", "用于主机与电池监测菊花链之间的通信桥接器。"),
  TPSI3050Q1: ti("TPSI3050-Q1", "TPSI3050-Q1", "隔离式开关驱动器", "集成隔离电源的隔离式开关驱动器。"),
  UCC12050: ti("UCC12050", "UCC12050", "隔离式 DC/DC", "集成变压器的隔离式直流/直流电源模块。"),
};

const diagrams: Diagram[] = [
  {
    id: "home-hvac", number: "01", name: "家用变频空调", subtitle: "电源、传感、控制、隔离通信与双电机驱动",
    description: "展示室内机与室外机之间的完整控制链路，突出高压功率级、低压控制域和隔离通信边界。",
    nodes: [
      { id: "ac", title: "交流输入", functions: ["EMI / Surge", "Rectifier"], x: 28, y: 92, width: 150, height: 82, passive: true },
      { id: "pfc", title: "功率因数校正", functions: ["PFC Controller"], x: 225, y: 72, width: 170, height: 102, products: ["UCC28180", "UCC28070"] },
      { id: "dc", title: "高压直流母线", functions: ["Bus Monitor", "Protection"], x: 450, y: 92, width: 165, height: 82, products: ["AMC1300", "INA240"] },
      { id: "ipm", title: "压缩机功率级", functions: ["Isolated Gate Driver", "Current Sense"], x: 680, y: 58, width: 210, height: 116, products: ["UCC21520", "UCC21750", "AMC1300", "TMCS1100"] },
      { id: "motor", title: "压缩机电机", functions: ["PMSM"], x: 970, y: 92, width: 150, height: 82, passive: true },
      { id: "fan", title: "风机驱动", functions: ["3-Phase Driver", "Current Sense"], x: 680, y: 250, width: 210, height: 108, products: ["UCC21520", "INA240"] },
      { id: "fanmotor", title: "风机电机", functions: ["BLDC"], x: 970, y: 266, width: 150, height: 82, passive: true },
      { id: "mcu", title: "实时控制器", functions: ["Motor Control", "System Control"], x: 420, y: 300, width: 210, height: 112, products: ["F280039C", "F280049C"] },
      { id: "sense", title: "环境与系统感知", functions: ["Temperature", "Pressure / Flow"], x: 90, y: 300, width: 220, height: 112, products: ["INA240", "TMCS1100"] },
      { id: "comms", title: "室内 / 室外机通信", functions: ["Isolated CAN", "Isolated RS-485"], x: 350, y: 500, width: 250, height: 112, products: ["ISO1042", "ISO1410", "ISO7741"] },
      { id: "aux", title: "辅助电源树", functions: ["Flyback", "HV Buck", "Point-of-Load"], x: 700, y: 490, width: 270, height: 122, products: ["UCC28740", "LM5164", "TPS54202", "UCC12050"] },
      { id: "ui", title: "用户与楼宇接口", functions: ["Display", "Wireless / Bus"], x: 85, y: 510, width: 210, height: 102, products: ["THVD1450", "TCAN1042H"] },
    ],
    links: [["ac","pfc"],["pfc","dc"],["dc","ipm"],["ipm","motor"],["dc","fan"],["fan","fanmotor"],["mcu","ipm"],["mcu","fan"],["sense","mcu"],["comms","mcu"],["ui","comms"],["dc","aux"],["aux","mcu"]],
  },
  {
    id: "commercial-hvac", number: "02", name: "商用多联机空调", subtitle: "多机总线、双功率级、隔离采样与集中控制",
    description: "面向多联机系统的分层架构：中央控制器协调压缩机、风机、阀组以及多个室内机节点。",
    nodes: [
      { id: "grid", title: "三相交流输入", functions: ["EMI Filter", "Surge Protection"], x: 25, y: 80, width: 160, height: 88, passive: true },
      { id: "rectifier", title: "整流与 PFC", functions: ["Interleaved PFC", "Bus Sense"], x: 225, y: 62, width: 205, height: 106, products: ["UCC28070", "AMC1300"] },
      { id: "bus", title: "直流母线", functions: ["Voltage Sense", "Precharge"], x: 480, y: 80, width: 170, height: 88, products: ["AMC1300", "TPSI3050Q1"] },
      { id: "compressor", title: "压缩机逆变器", functions: ["6× Gate Drive", "Phase Current"], x: 710, y: 48, width: 220, height: 120, products: ["UCC21750", "ISO7762", "INA240"] },
      { id: "compressor-motor", title: "压缩机", functions: ["PMSM"], x: 990, y: 78, width: 160, height: 90, passive: true },
      { id: "fan-drive", title: "室外风机逆变器", functions: ["Gate Drive", "Current Sense"], x: 710, y: 250, width: 220, height: 108, products: ["UCC21520", "TMCS1100"] },
      { id: "fan-motor", title: "室外风机", functions: ["BLDC"], x: 990, y: 260, width: 160, height: 88, passive: true },
      { id: "controller", title: "中央实时控制", functions: ["Dual Motor Control", "System Sequencing"], x: 435, y: 286, width: 230, height: 118, products: ["F28379D", "F280049C"] },
      { id: "indoor", title: "室内机节点 × N", functions: ["Local MCU", "Valve / Fan Drive"], x: 35, y: 286, width: 220, height: 112, products: ["F280039C", "TPS54202"] },
      { id: "bus-comms", title: "楼宇与多机总线", functions: ["Isolated RS-485", "CAN"], x: 90, y: 500, width: 245, height: 110, products: ["ISO1410", "TCAN1042H", "ISO7741"] },
      { id: "safety", title: "隔离采样与保护", functions: ["Current / Voltage", "Fault Isolation"], x: 430, y: 500, width: 230, height: 110, products: ["AMC1300", "INA240", "ISO7741"] },
      { id: "power-tree", title: "多域辅助电源", functions: ["Flyback", "Isolated DC/DC", "Buck"], x: 760, y: 490, width: 280, height: 120, products: ["UCC28740", "UCC12050", "LM5164"] },
    ],
    links: [["grid","rectifier"],["rectifier","bus"],["bus","compressor"],["compressor","compressor-motor"],["bus","fan-drive"],["fan-drive","fan-motor"],["controller","compressor"],["controller","fan-drive"],["indoor","controller"],["bus-comms","indoor"],["bus-comms","controller"],["safety","controller"],["bus","power-tree"],["power-tree","controller"]],
  },
  {
    id: "string-inverter", number: "03", name: "三相组串逆变器", subtitle: "多路 MPPT、隔离驱动、并网逆变与保护通信",
    description: "从光伏组串输入到并网输出的完整功率路径，控制器同时管理 MPPT、直流母线、三相逆变和并网保护。",
    nodes: [
      { id: "pv", title: "光伏组串 × N", functions: ["String Inputs", "Surge Protection"], x: 25, y: 85, width: 175, height: 90, passive: true },
      { id: "mppt", title: "多路升压 MPPT", functions: ["Isolated Driver", "Current / Voltage Sense"], x: 245, y: 58, width: 235, height: 117, products: ["UCC21750", "AMC1300", "INA240"] },
      { id: "hvbus", title: "高压直流链路", functions: ["Bus Sense", "Discharge / Relay"], x: 530, y: 78, width: 200, height: 97, products: ["AMC1300", "TPSI3050Q1"] },
      { id: "bridge", title: "三相逆变桥", functions: ["6× Isolated Gate Drive", "Phase Current Sense"], x: 785, y: 48, width: 245, height: 127, products: ["UCC21520", "UCC21750", "ISO7762", "TMCS1100"] },
      { id: "grid-filter", title: "并网滤波与继电器", functions: ["LCL Filter", "Grid Relay"], x: 1060, y: 78, width: 130, height: 97, passive: true },
      { id: "controller", title: "数字电源控制器", functions: ["MPPT Control", "Grid Control", "Protection"], x: 440, y: 300, width: 300, height: 120, products: ["F28379D", "F280049C"] },
      { id: "input-sense", title: "输入侧采样", functions: ["PV Voltage", "String Current"], x: 100, y: 300, width: 210, height: 105, products: ["AMC1300", "INA240"] },
      { id: "grid-sense", title: "电网侧采样", functions: ["Grid Voltage", "Phase Current"], x: 830, y: 300, width: 220, height: 105, products: ["AMC1300", "TMCS1100"] },
      { id: "comms", title: "监控与并机通信", functions: ["Isolated CAN", "RS-485"], x: 80, y: 505, width: 240, height: 108, products: ["ISO1042", "ISO1410", "THVD1450"] },
      { id: "aux", title: "隔离辅助电源", functions: ["Flyback", "Isolated Bias", "Buck"], x: 450, y: 495, width: 280, height: 118, products: ["UCC28740", "UCC12050", "LM5164", "TPS54202"] },
      { id: "safety", title: "安全与接口隔离", functions: ["Digital Isolation", "Relay Drive"], x: 850, y: 505, width: 230, height: 108, products: ["ISO7741", "ISO7762", "TPSI3050Q1"] },
    ],
    links: [["pv","mppt"],["mppt","hvbus"],["hvbus","bridge"],["bridge","grid-filter"],["input-sense","controller"],["grid-sense","controller"],["controller","mppt"],["controller","bridge"],["comms","controller"],["hvbus","aux"],["aux","controller"],["safety","controller"],["safety","grid-filter"]],
  },
  {
    id: "servo-drive", number: "04", name: "工业伺服驱动器", subtitle: "整流母线、三相逆变、编码器反馈与安全工业网络",
    description: "高性能多环控制架构，覆盖交流输入、制动单元、逆变功率级、位置反馈和工业实时通信。",
    nodes: [
      { id: "ac", title: "交流输入", functions: ["EMI", "Rectifier"], x: 25, y: 90, width: 160, height: 88, passive: true },
      { id: "dc", title: "直流链路与制动", functions: ["Bus Sense", "Brake Chopper"], x: 235, y: 70, width: 205, height: 108, products: ["AMC1300", "UCC21750"] },
      { id: "inverter", title: "三相功率逆变器", functions: ["6× Gate Drive", "Phase Current"], x: 505, y: 55, width: 235, height: 123, products: ["UCC21520", "UCC21750", "INA240", "TMCS1100"] },
      { id: "motor", title: "伺服电机", functions: ["PMSM", "Brake"], x: 805, y: 82, width: 170, height: 96, passive: true },
      { id: "encoder", title: "位置反馈", functions: ["Encoder", "Resolver"], x: 1015, y: 82, width: 150, height: 96, products: ["ISO7741", "INA240"] },
      { id: "control", title: "多环实时控制", functions: ["Position", "Speed", "Current"], x: 450, y: 300, width: 290, height: 122, products: ["F28379D", "F280049C"] },
      { id: "safety", title: "功能安全输入", functions: ["STO", "Fault Isolation"], x: 80, y: 300, width: 220, height: 108, products: ["ISO7762", "TPSI3050Q1"] },
      { id: "feedback", title: "隔离模拟反馈", functions: ["Current", "DC Bus", "Temperature"], x: 850, y: 300, width: 250, height: 112, products: ["AMC1300", "INA240", "TMCS1100"] },
      { id: "fieldbus", title: "工业现场总线", functions: ["Isolated RS-485", "CAN"], x: 85, y: 505, width: 250, height: 110, products: ["ISO1410", "ISO1042", "THVD1450"] },
      { id: "io", title: "数字与模拟 I/O", functions: ["Digital Isolation", "Protected I/O"], x: 430, y: 505, width: 250, height: 110, products: ["ISO7741", "ISO7762"] },
      { id: "aux", title: "控制与驱动电源", functions: ["Flyback", "Isolated DC/DC", "Buck"], x: 790, y: 495, width: 290, height: 120, products: ["UCC28740", "UCC12050", "LM5164"] },
    ],
    links: [["ac","dc"],["dc","inverter"],["inverter","motor"],["motor","encoder"],["encoder","control"],["control","inverter"],["safety","control"],["feedback","control"],["fieldbus","control"],["io","control"],["dc","aux"],["aux","control"]],
  },
  {
    id: "energy-storage", number: "05", name: "储能双向 PCS", subtitle: "电池簇、双向 DC/DC、三相并网与站级通信",
    description: "展示储能功率变换系统的双向能量路径，以及 BMS、主控制器、隔离采样和外部通信的协作关系。",
    nodes: [
      { id: "battery", title: "电池簇", functions: ["Cell Stack", "HV Contactor"], x: 25, y: 78, width: 175, height: 100, passive: true },
      { id: "bms", title: "电池管理系统", functions: ["Cell Monitor", "Daisy Chain Bridge"], x: 35, y: 260, width: 220, height: 112, products: ["BQ79616", "BQ79600Q1", "BQ76952"] },
      { id: "dcdc", title: "双向隔离 DC/DC", functions: ["Isolated Gate Drive", "Current Sense"], x: 270, y: 58, width: 245, height: 120, products: ["UCC21750", "UCC21520", "AMC1300", "TMCS1100"] },
      { id: "bus", title: "高压直流母线", functions: ["Voltage Sense", "Precharge / Discharge"], x: 565, y: 78, width: 210, height: 100, products: ["AMC1300", "TPSI3050Q1"] },
      { id: "inverter", title: "三相双向逆变器", functions: ["6× Isolated Drive", "Phase Current"], x: 825, y: 55, width: 245, height: 123, products: ["UCC21520", "UCC21750", "ISO7762", "INA240"] },
      { id: "grid", title: "滤波器与电网", functions: ["LCL", "Grid Relay"], x: 1100, y: 78, width: 92, height: 100, passive: true },
      { id: "control", title: "PCS 主控制器", functions: ["DC/DC Control", "Grid Control", "Protection"], x: 475, y: 310, width: 300, height: 124, products: ["F28379D", "F280049C"] },
      { id: "measure", title: "隔离采样链", functions: ["DC Current", "Grid Voltage", "Phase Current"], x: 850, y: 300, width: 270, height: 120, products: ["AMC1300", "INA240", "TMCS1100"] },
      { id: "comms", title: "BMS 与站控通信", functions: ["Isolated CAN", "Isolated RS-485"], x: 85, y: 500, width: 270, height: 112, products: ["ISO1042", "ISO1410", "ISO7741"] },
      { id: "aux", title: "多路隔离辅助电源", functions: ["Flyback", "Isolated Bias", "HV Buck"], x: 465, y: 495, width: 300, height: 117, products: ["UCC28740", "UCC12050", "LM5164"] },
      { id: "site", title: "站级 EMS / HMI", functions: ["CAN", "RS-485", "Service Port"], x: 850, y: 500, width: 270, height: 112, products: ["TCAN1042H", "THVD1450", "ISO7741"] },
    ],
    links: [["battery","dcdc"],["dcdc","bus"],["bus","inverter"],["inverter","grid"],["battery","bms"],["bms","control"],["control","dcdc"],["control","inverter"],["measure","control"],["comms","bms"],["comms","control"],["bus","aux"],["aux","control"],["site","control"]],
  },
  {
    id: "lv-bms", number: "06", name: "48V 低压 BMS", subtitle: "多节电芯监测、保护开关、隔离通信与负载控制",
    description: "面向 12 至 16 节串联电池组的低压电池管理架构，覆盖电芯采样、均衡、保护、主控和车身通信。",
    nodes: [
      { id: "cells", title: "12–16S 电芯组", functions: ["Cell Taps", "Temperature"], x: 35, y: 85, width: 190, height: 100, passive: true },
      { id: "monitor", title: "电池监测与均衡", functions: ["Cell ADC", "Passive Balance", "Protection"], x: 285, y: 60, width: 260, height: 125, products: ["BQ76952", "BQ79616"] },
      { id: "current", title: "电流与电量计量", functions: ["Shunt Sense", "Coulomb Count"], x: 605, y: 75, width: 225, height: 110, products: ["INA240", "TMCS1100"] },
      { id: "switch", title: "充放电保护开关", functions: ["Charge FET", "Discharge FET"], x: 890, y: 65, width: 230, height: 120, products: ["TPSI3050Q1", "ISO7741"] },
      { id: "load", title: "48V 系统负载", functions: ["Vehicle / Telecom"], x: 1135, y: 85, width: 55, height: 100, passive: true },
      { id: "mcu", title: "BMS 主控制器", functions: ["State Estimation", "Diagnostics", "Data Logging"], x: 470, y: 310, width: 300, height: 125, products: ["F280039C", "F280049C"] },
      { id: "isolation", title: "监测链路隔离", functions: ["Digital Isolator", "Isolated Power"], x: 130, y: 310, width: 250, height: 115, products: ["ISO7741", "ISO7762", "UCC12050", "BQ79600Q1"] },
      { id: "thermal", title: "热管理与执行器", functions: ["Temperature Inputs", "Fan / Heater Drive"], x: 850, y: 310, width: 260, height: 115, products: ["INA240", "TPS54202"] },
      { id: "comms", title: "车身 / 储能通信", functions: ["Isolated CAN", "RS-485"], x: 100, y: 510, width: 250, height: 108, products: ["ISO1042", "ISO1410", "TCAN1042H"] },
      { id: "power", title: "48V 辅助电源树", functions: ["Wide VIN Buck", "Point-of-Load", "Isolation"], x: 455, y: 500, width: 310, height: 118, products: ["LM5164", "TPS54202", "UCC12050"] },
      { id: "service", title: "诊断与服务接口", functions: ["UART / SPI Isolation", "Service CAN"], x: 855, y: 510, width: 255, height: 108, products: ["ISO7741", "ISO7762", "TCAN1042H"] },
    ],
    links: [["cells","monitor"],["monitor","current"],["current","switch"],["switch","load"],["monitor","mcu"],["current","mcu"],["mcu","switch"],["isolation","mcu"],["thermal","mcu"],["comms","mcu"],["power","mcu"],["service","mcu"]],
  },
];

function getPath(from: DiagramNode, to: DiagramNode) {
  const forward = to.x >= from.x;
  const startX = forward ? from.x + from.width : from.x;
  const endX = forward ? to.x : to.x + to.width;
  const startY = from.y + from.height / 2;
  const endY = to.y + to.height / 2;
  const middleX = startX + (endX - startX) / 2;
  return `M ${startX} ${startY} H ${middleX} V ${endY} H ${endX}`;
}

function SystemDiagram({ diagram, selectedId, onSelect }: { diagram: Diagram; selectedId: string; onSelect: (id: string) => void }) {
  const nodeMap = new Map(diagram.nodes.map((node) => [node.id, node]));
  return (
    <svg id="system-diagram" className="system-svg" viewBox="0 0 1200 680" role="img" aria-label={`${diagram.name}工程系统框图`}>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#68737d" /></marker>
        <pattern id="dot-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#e7ecee" /></pattern>
      </defs>
      <rect width="1200" height="680" fill="#fbfcfc" />
      <rect width="1200" height="680" fill="url(#dot-grid)" />
      <g className="svg-links">
        {diagram.links.map(([fromId, toId]) => {
          const from = nodeMap.get(fromId); const to = nodeMap.get(toId);
          return from && to ? <path key={`${fromId}-${toId}`} d={getPath(from, to)} markerEnd="url(#arrow)" /> : null;
        })}
      </g>
      <g>
        {diagram.nodes.map((node) => {
          const active = Boolean(node.products?.length);
          const chipGap = 7;
          const chipAreaWidth = node.width - 22;
          const chipWidth = (chipAreaWidth - chipGap * (node.functions.length - 1)) / node.functions.length;
          const isSelected = node.id === selectedId;
          const handleKey = (event: KeyboardEvent<SVGGElement>) => {
            if (active && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onSelect(node.id); }
          };
          return (
            <g
              key={node.id}
              className={`svg-node ${active ? "is-clickable" : "is-passive"} ${isSelected ? "is-selected" : ""}`}
              role={active ? "button" : undefined}
              tabIndex={active ? 0 : undefined}
              aria-label={active ? `查看${node.title}的 TI 产品` : undefined}
              onClick={() => active && onSelect(node.id)}
              onKeyDown={handleKey}
            >
              <rect className="node-shell" x={node.x} y={node.y} width={node.width} height={node.height} rx="2" />
              <rect className="node-cap" x={node.x} y={node.y} width="5" height={node.height} />
              {node.functions.map((label, index) => {
                const chipX = node.x + 11 + index * (chipWidth + chipGap);
                const fontSize = label.length > 17 ? 10 : label.length > 12 ? 11 : 12;
                return (
                  <g key={label}>
                    <rect className="function-chip" x={chipX} y={node.y + 12} width={chipWidth} height={node.height - 43} rx="1" />
                    <text className="function-label" x={chipX + chipWidth / 2} y={node.y + 12 + (node.height - 43) / 2 + 4} textAnchor="middle" fontSize={fontSize}>{label}</text>
                  </g>
                );
              })}
              <text className="node-title" x={node.x + node.width / 2} y={node.y + node.height - 12} textAnchor="middle">{node.title}</text>
              {active && <circle className="node-status" cx={node.x + node.width - 9} cy={node.y + node.height - 10} r="3" />}
            </g>
          );
        })}
      </g>
      <text x="1180" y="661" textAnchor="end" className="svg-signature">SYSTEM ATLAS · ORIGINAL INTERACTIVE SVG</text>
    </svg>
  );
}

export default function Home() {
  const [diagramId, setDiagramId] = useState(diagrams[0].id);
  const [selectedId, setSelectedId] = useState(diagrams[0].nodes.find((node) => node.products?.length)?.id ?? diagrams[0].nodes[0].id);
  const [tab, setTab] = useState<"products" | "notes">("products");
  const [zoom, setZoom] = useState(1);
  const diagram = useMemo(() => diagrams.find((item) => item.id === diagramId) ?? diagrams[0], [diagramId]);
  const selected = diagram.nodes.find((node) => node.id === selectedId) ?? diagram.nodes.find((node) => node.products?.length) ?? diagram.nodes[0];
  const products = (selected.products ?? []).map((id) => PRODUCTS[id]).filter(Boolean);

  function chooseDiagram(next: Diagram) {
    setDiagramId(next.id);
    setSelectedId(next.nodes.find((node) => node.products?.length)?.id ?? next.nodes[0].id);
    setZoom(1);
    setTab("products");
  }

  function downloadSvg() {
    const source = document.getElementById("system-diagram");
    if (!source) return;
    const clone = source.cloneNode(true) as SVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `${diagram.id}-system-diagram.svg`; anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="site-brand" href="#top"><span className="brand-grid" aria-hidden="true"><i /><i /><i /><i /></span><span><strong>SYSTEM ATLAS</strong><small>INTERACTIVE ENGINEERING MAPS</small></span></a>
        <div className="header-meta"><span>6 APPLICATIONS</span><span>SVG / REACT</span><a href="https://github.com/0731Shayne/system" target="_blank" rel="noreferrer">SOURCE ↗</a></div>
      </header>

      <section className="intro" id="top">
        <p>POWER ELECTRONICS · MOTOR CONTROL · BATTERY MANAGEMENT</p>
        <div><h1>交互式工程系统框图</h1><span>点击红色功能模块，查看公开的 TI 产品映射与官方资料链接。</span></div>
      </section>

      <nav className="diagram-tabs" aria-label="选择应用系统">
        {diagrams.map((item) => (
          <button key={item.id} type="button" className={item.id === diagram.id ? "active" : ""} onClick={() => chooseDiagram(item)}>
            <span>{item.number}</span><strong>{item.name}</strong><small>{item.subtitle}</small>
          </button>
        ))}
      </nav>

      <section className="diagram-workspace" style={{ "--zoom": zoom } as CSSProperties}>
        <section className="diagram-pane">
          <div className="diagram-toolbar">
            <div><p>APPLICATION {diagram.number}</p><h2>{diagram.name}</h2><span>{diagram.subtitle}</span></div>
            <div className="toolbar-actions">
              <button type="button" onClick={downloadSvg}>下载 SVG</button>
              <div className="zoom-tools"><button type="button" aria-label="缩小" onClick={() => setZoom((z) => Math.max(.8, +(z - .1).toFixed(1)))}>−</button><output>{Math.round(zoom * 100)}%</output><button type="button" aria-label="放大" onClick={() => setZoom((z) => Math.min(1.3, +(z + .1).toFixed(1)))}>＋</button></div>
            </div>
          </div>
          <div className="diagram-summary"><span className="red-key" />红色：可点击产品功能模块 <span className="gray-key" />灰色：系统结构或外部器件</div>
          <div className="svg-scroller"><div className="svg-scale"><SystemDiagram diagram={diagram} selectedId={selected.id} onSelect={(id) => { setSelectedId(id); setTab("products"); }} /></div></div>
          <div className="diagram-footer"><span>{diagram.description}</span><strong>{diagram.nodes.filter((node) => node.products?.length).length} 个产品映射区域</strong></div>
        </section>

        <aside className="resource-pane" aria-live="polite">
          <div className="resource-head"><p>SELECTED FUNCTION</p><h2>{selected.title}</h2><span>{selected.functions.join(" · ")}</span></div>
          <div className="resource-tabs"><button type="button" className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>产品 <em>{products.length}</em></button><button type="button" className={tab === "notes" ? "active" : ""} onClick={() => setTab("notes")}>设计说明</button></div>
          {tab === "products" ? (
            <div className="product-results">
              <div className="result-label"><span>TI 官方公开产品</span><small>按功能匹配</small></div>
              {products.map((item) => (
                <article className="ti-product" key={item.id}>
                  <div><span>{item.category}</span><a href={item.url} target="_blank" rel="noreferrer" aria-label={`在 TI 官网查看 ${item.name}`}>TI.COM ↗</a></div>
                  <h3><a href={item.url} target="_blank" rel="noreferrer">{item.name}</a></h3>
                  <p>{item.description}</p>
                  <footer><span>数据来源：TI 官方产品页</span><a href={item.url} target="_blank" rel="noreferrer">查看产品资料</a></footer>
                </article>
              ))}
            </div>
          ) : (
            <div className="design-notes"><h3>模块职责</h3><p>{diagram.description}</p><h3>功能组成</h3><ul>{selected.functions.map((item) => <li key={item}>{item}</li>)}</ul><h3>交互规则</h3><p>红色模块关联公开产品；灰色模块仅用于表达能量流、控制流和系统边界。</p></div>
          )}
          <div className="legal-note"><strong>非官方演示</strong><p>本页面为个人前端与信息架构作品，不隶属于 Texas Instruments。TI、C2000 及相关产品名称归其权利人所有；产品信息以链接所指向的 TI 官方页面为准。</p></div>
        </aside>
      </section>

      <footer className="site-footer"><div><strong>SYSTEM ATLAS</strong><span>原创 SVG 构图与交互实现</span></div><p>页面未复制 TI 官方框图或页面代码，仅使用公开产品名称与官方链接进行功能映射演示。</p><span>© 2026 SHAYNE</span></footer>
    </main>
  );
}
