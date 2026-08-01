"use client";

import { CSSProperties, useMemo, useState } from "react";

type Layer = "power" | "control" | "sense" | "interface";

type ConceptProduct = {
  name: string;
  family: string;
  summary: string;
  tags: string[];
};

type DiagramNode = {
  id: string;
  title: string;
  eyebrow: string;
  layer: Layer;
  x: number;
  y: number;
  w: number;
  h: number;
  detail: string;
  products: ConceptProduct[];
};

type Wire = {
  from: [number, number];
  to: [number, number];
  flow?: "forward" | "both";
};

type Diagram = {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  accent: string;
  nodes: DiagramNode[];
  wires: Wire[];
};

const product = (name: string, family: string, summary: string, tags: string[]): ConceptProduct => ({
  name,
  family,
  summary,
  tags,
});

const sharedProducts = {
  gate: product("DEMO-GATE-06", "隔离驱动器 · 概念型号", "六通道栅极驱动参考器件，支持故障反馈与欠压保护。", ["6 通道", "隔离", "保护"]),
  power: product("DEMO-POWER-48", "电源模块 · 概念型号", "面向控制域的宽输入辅助电源参考模块。", ["宽输入", "高效率"]),
  sense: product("DEMO-SENSE-I2", "精密采样 · 概念型号", "双通道电流与母线电压同步采样参考器件。", ["双通道", "低漂移"]),
  comms: product("DEMO-LINK-04", "隔离通信 · 概念型号", "四通道隔离收发参考器件，适合跨电源域数据链路。", ["4 通道", "故障安全"]),
  mcu: product("DEMO-CTRL-M7", "实时控制器 · 概念型号", "用于多回路控制与状态机管理的实时控制平台。", ["实时控制", "多协议"]),
  monitor: product("DEMO-MON-16", "监测前端 · 概念型号", "多通道状态监测与诊断参考前端。", ["16 通道", "诊断"]),
};

const diagrams: Diagram[] = [
  {
    id: "climate-loop",
    index: "01",
    name: "智能气候环",
    subtitle: "从环境感知到变频执行的闭环控制架构",
    accent: "#ff7a59",
    nodes: [
      { id: "climate-sensors", title: "环境传感阵列", eyebrow: "INPUT", layer: "sense", x: 6, y: 14, w: 18, h: 19, detail: "采集温度、湿度、空气质量和占用状态，为控制策略提供统一输入。", products: [sharedProducts.monitor] },
      { id: "climate-hub", title: "实时控制中枢", eyebrow: "DECIDE", layer: "control", x: 37, y: 35, w: 22, h: 23, detail: "执行温控算法、负载预测、保护逻辑与整机状态管理。", products: [sharedProducts.mcu] },
      { id: "climate-drive", title: "三相变频驱动", eyebrow: "ACTUATE", layer: "power", x: 72, y: 12, w: 20, h: 20, detail: "控制压缩机与风机功率级，实现高效、低噪声的连续调速。", products: [sharedProducts.gate] },
      { id: "climate-valve", title: "阀组与风门", eyebrow: "ACTUATE", layer: "power", x: 72, y: 43, w: 20, h: 18, detail: "驱动电子膨胀阀、风门和辅助执行器，完成热量分配。", products: [product("DEMO-LOAD-08", "多路负载驱动 · 概念型号", "八通道低边驱动参考器件，带开路与过流诊断。", ["8 通道", "诊断"])] },
      { id: "climate-link", title: "建筑通信网关", eyebrow: "CONNECT", layer: "interface", x: 7, y: 64, w: 21, h: 18, detail: "连接房间终端、楼宇控制器与远程运维平台。", products: [sharedProducts.comms] },
      { id: "climate-power", title: "辅助电源树", eyebrow: "SUPPLY", layer: "power", x: 38, y: 72, w: 20, h: 16, detail: "为控制、传感、通信和驱动域提供分级低压电源。", products: [sharedProducts.power] },
      { id: "climate-feedback", title: "电流与母线反馈", eyebrow: "VERIFY", layer: "sense", x: 72, y: 72, w: 20, h: 17, detail: "监测功率级电流与直流母线，支持效率计算与快速保护。", products: [sharedProducts.sense] },
    ],
    wires: [
      { from: [24, 23], to: [37, 43] }, { from: [28, 73], to: [37, 51] },
      { from: [59, 43], to: [72, 22] }, { from: [59, 49], to: [72, 52] },
      { from: [48, 72], to: [48, 58] }, { from: [72, 80], to: [59, 55], flow: "both" },
      { from: [82, 72], to: [82, 32], flow: "both" },
    ],
  },
  {
    id: "solar-microgrid",
    index: "02",
    name: "光储微电网",
    subtitle: "光伏、储能与关键负载的双向能量编排",
    accent: "#f2b84b",
    nodes: [
      { id: "solar-array", title: "光伏阵列", eyebrow: "SOURCE", layer: "power", x: 5, y: 13, w: 18, h: 18, detail: "汇集多路光伏输入并提供支路状态信息。", products: [product("DEMO-PV-MON", "光伏监测 · 概念型号", "多支路电压与电流监测参考前端。", ["多支路", "高压"])] },
      { id: "solar-mppt", title: "多路 MPPT", eyebrow: "CONVERT", layer: "power", x: 32, y: 13, w: 20, h: 18, detail: "独立跟踪各光伏支路最大功率点并升压至直流母线。", products: [sharedProducts.gate, sharedProducts.sense] },
      { id: "solar-bus", title: "高压直流母线", eyebrow: "DISTRIBUTE", layer: "power", x: 63, y: 13, w: 22, h: 18, detail: "连接光伏、储能与并网变换器，是系统能量交换的核心。", products: [sharedProducts.sense] },
      { id: "solar-battery", title: "储能电池簇", eyebrow: "STORE", layer: "power", x: 7, y: 67, w: 19, h: 18, detail: "在能量过剩时充电，在峰值负载或离网时放电。", products: [sharedProducts.monitor] },
      { id: "solar-bidir", title: "双向 DC/DC", eyebrow: "BALANCE", layer: "power", x: 34, y: 67, w: 19, h: 18, detail: "调节电池簇与母线间的双向功率流。", products: [sharedProducts.gate] },
      { id: "solar-inverter", title: "并离网逆变器", eyebrow: "GRID", layer: "power", x: 66, y: 67, w: 19, h: 18, detail: "完成直流到交流转换、并网同步和离网成网控制。", products: [sharedProducts.gate, sharedProducts.sense] },
      { id: "solar-ems", title: "能量管理中枢", eyebrow: "ORCHESTRATE", layer: "control", x: 37, y: 39, w: 23, h: 20, detail: "根据预测、负载、价格与安全边界安排能量流。", products: [sharedProducts.mcu] },
      { id: "solar-cloud", title: "边缘数据网关", eyebrow: "OBSERVE", layer: "interface", x: 74, y: 39, w: 18, h: 20, detail: "汇总运行数据并提供远程监控、告警和策略下发。", products: [sharedProducts.comms] },
    ],
    wires: [
      { from: [23, 22], to: [32, 22] }, { from: [52, 22], to: [63, 22] },
      { from: [17, 67], to: [17, 31] }, { from: [26, 76], to: [34, 76], flow: "both" },
      { from: [53, 76], to: [66, 76], flow: "both" }, { from: [76, 67], to: [76, 31], flow: "both" },
      { from: [48, 39], to: [48, 31], flow: "both" }, { from: [60, 49], to: [74, 49], flow: "both" },
    ],
  },
  {
    id: "robot-cell",
    index: "03",
    name: "协作机器人单元",
    subtitle: "安全感知、运动控制与多轴伺服协同",
    accent: "#8a7dff",
    nodes: [
      { id: "robot-vision", title: "3D 视觉", eyebrow: "PERCEIVE", layer: "sense", x: 5, y: 14, w: 18, h: 18, detail: "识别工件姿态、操作区域与人员距离。", products: [product("DEMO-VISION-EDGE", "边缘视觉 · 概念型号", "面向深度图预处理与目标定位的边缘计算模块。", ["3D", "低延迟"])] },
      { id: "robot-safety", title: "安全控制器", eyebrow: "PROTECT", layer: "control", x: 5, y: 66, w: 18, h: 18, detail: "汇总急停、门锁、力矩与区域安全信号。", products: [sharedProducts.monitor] },
      { id: "robot-motion", title: "运动控制核心", eyebrow: "PLAN", layer: "control", x: 36, y: 38, w: 23, h: 22, detail: "完成轨迹规划、运动学解算和多轴同步。", products: [sharedProducts.mcu] },
      { id: "robot-ether", title: "实时工业网络", eyebrow: "SYNC", layer: "interface", x: 37, y: 72, w: 21, h: 15, detail: "在控制核心和伺服轴间传输同步命令与状态。", products: [sharedProducts.comms] },
      { id: "robot-joint", title: "六轴伺服阵列", eyebrow: "MOVE", layer: "power", x: 72, y: 13, w: 21, h: 19, detail: "由六个紧凑伺服节点组成，驱动各关节电机。", products: [sharedProducts.gate] },
      { id: "robot-force", title: "力矩与位置反馈", eyebrow: "FEEDBACK", layer: "sense", x: 72, y: 42, w: 21, h: 18, detail: "融合编码器、相电流和末端力矩信息实现柔顺控制。", products: [sharedProducts.sense] },
      { id: "robot-tool", title: "末端工具接口", eyebrow: "TOOL", layer: "interface", x: 72, y: 70, w: 21, h: 17, detail: "为夹爪、吸盘和传感工具提供电源与通信。", products: [product("DEMO-TOOL-IO", "智能 I/O · 概念型号", "四路可配置工业 I/O 与工具通信接口。", ["可配置", "保护"])] },
    ],
    wires: [
      { from: [23, 23], to: [36, 45] }, { from: [23, 75], to: [36, 54] },
      { from: [48, 60], to: [48, 72], flow: "both" }, { from: [58, 79], to: [72, 79], flow: "both" },
      { from: [59, 45], to: [72, 23] }, { from: [72, 51], to: [59, 53], flow: "both" },
      { from: [82, 42], to: [82, 32], flow: "both" },
    ],
  },
  {
    id: "mobility-drive",
    index: "04",
    name: "轻型电驱平台",
    subtitle: "电池、牵引逆变与车身能源的集成控制",
    accent: "#48d6a5",
    nodes: [
      { id: "mobility-pack", title: "高压电池包", eyebrow: "ENERGY", layer: "power", x: 5, y: 38, w: 19, h: 21, detail: "提供牵引能量并实时上报电芯与热状态。", products: [sharedProducts.monitor] },
      { id: "mobility-protect", title: "高压保护与预充", eyebrow: "PROTECT", layer: "power", x: 31, y: 14, w: 20, h: 18, detail: "管理主接触器、预充回路和高压互锁。", products: [product("DEMO-HV-SW", "高压开关监控 · 概念型号", "接触器驱动与诊断参考器件。", ["预充", "诊断"])] },
      { id: "mobility-inverter", title: "牵引逆变器", eyebrow: "DRIVE", layer: "power", x: 65, y: 14, w: 21, h: 18, detail: "将电池直流能量转换为三相电机驱动。", products: [sharedProducts.gate, sharedProducts.sense] },
      { id: "mobility-vcu", title: "整车控制器", eyebrow: "COORDINATE", layer: "control", x: 37, y: 41, w: 22, h: 20, detail: "协调扭矩请求、能量回收、热管理和故障降级。", products: [sharedProducts.mcu] },
      { id: "mobility-motor", title: "永磁电机", eyebrow: "MOTION", layer: "power", x: 73, y: 42, w: 19, h: 18, detail: "输出驱动扭矩，并通过位置传感器形成控制闭环。", products: [product("DEMO-POS-02", "位置接口 · 概念型号", "双通道旋变与编码器信号调理参考前端。", ["双通道", "车载概念"])] },
      { id: "mobility-dcdc", title: "高压转低压 DC/DC", eyebrow: "SUPPLY", layer: "power", x: 31, y: 70, w: 22, h: 17, detail: "从动力电池为低压车身网络供电。", products: [sharedProducts.power] },
      { id: "mobility-body", title: "车身低压网络", eyebrow: "AUX", layer: "interface", x: 66, y: 70, w: 21, h: 17, detail: "连接照明、仪表、通信与辅助负载。", products: [sharedProducts.comms] },
    ],
    wires: [
      { from: [24, 48], to: [37, 50], flow: "both" }, { from: [24, 43], to: [31, 23] },
      { from: [51, 23], to: [65, 23] }, { from: [75, 32], to: [82, 42], flow: "both" },
      { from: [59, 48], to: [73, 51], flow: "both" }, { from: [42, 61], to: [42, 70] },
      { from: [53, 79], to: [66, 79] },
    ],
  },
  {
    id: "data-power",
    index: "05",
    name: "数据中心电源架",
    subtitle: "高密度电能转换、冗余分配与健康监测",
    accent: "#4fb7ff",
    nodes: [
      { id: "data-input", title: "三相交流输入", eyebrow: "INPUT", layer: "power", x: 5, y: 15, w: 18, h: 17, detail: "完成输入检测、浪涌防护与支路管理。", products: [sharedProducts.monitor] },
      { id: "data-pfc", title: "交错 PFC", eyebrow: "RECTIFY", layer: "power", x: 31, y: 15, w: 19, h: 17, detail: "将交流输入转换为稳定高压直流母线。", products: [sharedProducts.gate, sharedProducts.sense] },
      { id: "data-bus", title: "高压直流母线", eyebrow: "BUS", layer: "power", x: 61, y: 15, w: 20, h: 17, detail: "为多个隔离电源砖提供共享能源。", products: [sharedProducts.sense] },
      { id: "data-bricks", title: "并联电源砖", eyebrow: "CONVERT", layer: "power", x: 70, y: 43, w: 22, h: 21, detail: "多个隔离变换单元并联输出，支持热插拔和冗余。", products: [sharedProducts.gate, sharedProducts.power] },
      { id: "data-output", title: "48V 机架母线", eyebrow: "DELIVER", layer: "power", x: 69, y: 74, w: 22, h: 15, detail: "向服务器托盘与加速卡供电。", products: [product("DEMO-BUS-MON", "母线监测 · 概念型号", "机架母线电压、电流与能耗计量参考器件。", ["热插拔", "计量"])] },
      { id: "data-control", title: "数字电源控制", eyebrow: "REGULATE", layer: "control", x: 34, y: 42, w: 22, h: 21, detail: "协调均流、时序、保护和效率优化。", products: [sharedProducts.mcu] },
      { id: "data-telemetry", title: "遥测与运维接口", eyebrow: "MANAGE", layer: "interface", x: 6, y: 72, w: 22, h: 17, detail: "向机架管理系统上报功率、温度与故障记录。", products: [sharedProducts.comms] },
      { id: "data-thermal", title: "热状态阵列", eyebrow: "SENSE", layer: "sense", x: 7, y: 43, w: 20, h: 18, detail: "采集功率器件、磁性元件与风道温度。", products: [sharedProducts.monitor] },
    ],
    wires: [
      { from: [23, 23], to: [31, 23] }, { from: [50, 23], to: [61, 23] },
      { from: [71, 32], to: [81, 43] }, { from: [81, 64], to: [80, 74] },
      { from: [56, 52], to: [70, 52], flow: "both" }, { from: [27, 52], to: [34, 52] },
      { from: [28, 80], to: [45, 63], flow: "both" },
    ],
  },
  {
    id: "charging-hub",
    index: "06",
    name: "智慧充电枢纽",
    subtitle: "多枪快充、站级配电与云端运营的模块化架构",
    accent: "#ff5f91",
    nodes: [
      { id: "charge-grid", title: "站级配电入口", eyebrow: "GRID", layer: "power", x: 5, y: 13, w: 19, h: 18, detail: "连接电网并执行计量、保护与负荷边界管理。", products: [sharedProducts.monitor] },
      { id: "charge-acdc", title: "功率模块池", eyebrow: "CONVERT", layer: "power", x: 34, y: 12, w: 22, h: 20, detail: "多个 AC/DC 模块动态组合，为不同终端分配功率。", products: [sharedProducts.gate, sharedProducts.sense] },
      { id: "charge-router", title: "直流功率路由", eyebrow: "ROUTE", layer: "power", x: 68, y: 13, w: 22, h: 18, detail: "通过高压开关矩阵将功率模块连接到目标充电终端。", products: [product("DEMO-ROUTE-12", "功率路由控制 · 概念型号", "十二路高压状态监测与开关控制参考方案。", ["12 路", "互锁"])] },
      { id: "charge-controller", title: "站级控制器", eyebrow: "SCHEDULE", layer: "control", x: 37, y: 42, w: 22, h: 21, detail: "负责功率调度、充电会话、安全联锁和本地策略。", products: [sharedProducts.mcu] },
      { id: "charge-terminal", title: "快充终端阵列", eyebrow: "DELIVER", layer: "power", x: 70, y: 43, w: 21, h: 19, detail: "面向多个车位提供充电枪、计量、锁止和人机交互。", products: [sharedProducts.comms] },
      { id: "charge-isolation", title: "绝缘与环境监测", eyebrow: "PROTECT", layer: "sense", x: 6, y: 43, w: 21, h: 19, detail: "监测绝缘、温度、烟雾、门禁和急停状态。", products: [sharedProducts.monitor] },
      { id: "charge-edge", title: "边缘运营网关", eyebrow: "OPERATE", layer: "interface", x: 35, y: 74, w: 24, h: 15, detail: "连接云端运营平台，并在断网时维持本地服务。", products: [sharedProducts.comms] },
      { id: "charge-storage", title: "站内缓冲储能", eyebrow: "BUFFER", layer: "power", x: 7, y: 74, w: 20, h: 15, detail: "降低峰值需量并为受限配电容量提供瞬时补能。", products: [sharedProducts.power] },
      { id: "charge-cloud", title: "云端运营平台", eyebrow: "CLOUD", layer: "interface", x: 70, y: 74, w: 21, h: 15, detail: "提供设备管理、订单服务、告警与能效分析。", products: [product("DEMO-CLOUD-API", "开放接口 · 概念服务", "面向运营系统的设备与订单 API 概念服务。", ["API", "遥测"])] },
    ],
    wires: [
      { from: [24, 22], to: [34, 22] }, { from: [56, 22], to: [68, 22] },
      { from: [79, 31], to: [80, 43] }, { from: [59, 52], to: [70, 52], flow: "both" },
      { from: [27, 52], to: [37, 52] }, { from: [47, 63], to: [47, 74], flow: "both" },
      { from: [27, 81], to: [35, 81], flow: "both" }, { from: [59, 81], to: [70, 81], flow: "both" },
    ],
  },
];

const layerLabels: Record<Layer, string> = {
  power: "能量",
  control: "控制",
  sense: "感知",
  interface: "连接",
};

function wireStyle(wire: Wire): CSSProperties {
  const [x1, y1] = wire.from;
  const [x2, y2] = wire.to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  return {
    left: `${x1}%`,
    top: `${y1}%`,
    width: `${Math.sqrt(dx * dx + dy * dy)}%`,
    transform: `rotate(${Math.atan2(dy, dx) * (180 / Math.PI)}deg)`,
  };
}

export default function Home() {
  const [diagramId, setDiagramId] = useState(diagrams[0].id);
  const [selectedNodeId, setSelectedNodeId] = useState(diagrams[0].nodes[1].id);
  const [zoom, setZoom] = useState(1);

  const diagram = useMemo(() => diagrams.find((item) => item.id === diagramId) ?? diagrams[0], [diagramId]);
  const selectedNode = diagram.nodes.find((node) => node.id === selectedNodeId) ?? diagram.nodes[0];

  function selectDiagram(next: Diagram) {
    setDiagramId(next.id);
    setSelectedNodeId(next.nodes[0].id);
    setZoom(1);
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="FluxCanvas 首页">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>FluxCanvas</span>
        </a>
        <span className="topbar-note">Interactive systems · Original concept work</span>
        <a className="source-link" href="https://github.com/0731Shayne/system" target="_blank" rel="noreferrer">查看源码 <span>↗</span></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-kicker"><span />个人前端作品 · 2026</div>
        <div className="hero-copy">
          <h1>复杂系统，<br /><em>一眼看懂。</em></h1>
          <p>一套从零设计的交互式系统架构浏览器。选择应用、点击模块，即时查看功能说明与概念产品映射。</p>
        </div>
        <div className="hero-stats" aria-label="项目概览">
          <div><strong>06</strong><span>原创系统</span></div>
          <div><strong>46</strong><span>交互模块</span></div>
          <div><strong>100%</strong><span>响应式体验</span></div>
        </div>
      </section>

      <section className="explorer" aria-label="系统架构浏览器">
        <div className="explorer-head">
          <div>
            <p className="section-label">SYSTEM EXPLORER</p>
            <h2>选择一个应用场景</h2>
          </div>
          <div className="legend" aria-label="模块图例">
            {(Object.entries(layerLabels) as [Layer, string][]).map(([key, label]) => (
              <span key={key}><i className={`legend-dot ${key}`} />{label}</span>
            ))}
          </div>
        </div>

        <nav className="scenario-nav" aria-label="选择应用场景">
          {diagrams.map((item) => (
            <button
              type="button"
              key={item.id}
              className={item.id === diagram.id ? "scenario-button active" : "scenario-button"}
              onClick={() => selectDiagram(item)}
              aria-current={item.id === diagram.id ? "page" : undefined}
            >
              <span>{item.index}</span>
              <strong>{item.name}</strong>
            </button>
          ))}
        </nav>

        <div className="workspace" style={{ "--accent": diagram.accent } as CSSProperties}>
          <section className="canvas-panel">
            <div className="canvas-heading">
              <div>
                <p>{diagram.index} / ARCHITECTURE</p>
                <h3>{diagram.name}</h3>
                <span>{diagram.subtitle}</span>
              </div>
              <div className="zoom-control" aria-label="缩放控制">
                <button type="button" onClick={() => setZoom((value) => Math.max(0.8, +(value - 0.1).toFixed(1)))} aria-label="缩小">−</button>
                <output>{Math.round(zoom * 100)}%</output>
                <button type="button" onClick={() => setZoom((value) => Math.min(1.3, +(value + 0.1).toFixed(1)))} aria-label="放大">＋</button>
              </div>
            </div>

            <div className="canvas-scroll">
              <div className="diagram-canvas" style={{ transform: `scale(${zoom})` }}>
                <div className="grid-plane" aria-hidden="true" />
                {diagram.wires.map((wire, index) => (
                  <span key={`${diagram.id}-wire-${index}`} className={`wire ${wire.flow === "both" ? "both" : ""}`} style={wireStyle(wire)} aria-hidden="true" />
                ))}
                {diagram.nodes.map((node) => (
                  <button
                    type="button"
                    key={node.id}
                    data-testid={`node-${node.id}`}
                    className={`diagram-node ${node.layer} ${node.id === selectedNode.id ? "selected" : ""}`}
                    style={{ left: `${node.x}%`, top: `${node.y}%`, width: `${node.w}%`, height: `${node.h}%` }}
                    onClick={() => setSelectedNodeId(node.id)}
                    aria-pressed={node.id === selectedNode.id}
                  >
                    <span>{node.eyebrow}</span>
                    <strong>{node.title}</strong>
                    <i aria-hidden="true" />
                  </button>
                ))}
                <div className="canvas-signature" aria-hidden="true">FC / ORIGINAL SYSTEM MAP</div>
              </div>
            </div>

            <div className="canvas-foot">
              <span><i className="pulse-dot" />点击任意模块查看详情</span>
              <span>{diagram.nodes.length} 个可交互节点</span>
            </div>
          </section>

          <aside className="detail-panel" aria-live="polite">
            <div className="detail-index">{diagram.index}.{String(diagram.nodes.indexOf(selectedNode) + 1).padStart(2, "0")}</div>
            <p className="detail-eyebrow">{selectedNode.eyebrow} · {layerLabels[selectedNode.layer]}</p>
            <h3>{selectedNode.title}</h3>
            <p className="detail-description">{selectedNode.detail}</p>

            <div className="detail-rule"><span /></div>
            <div className="product-heading">
              <div>
                <span>CONCEPT COMPONENTS</span>
                <strong>概念产品</strong>
              </div>
              <em>{selectedNode.products.length}</em>
            </div>

            <div className="product-list">
              {selectedNode.products.map((item) => (
                <article className="product-card" key={item.name}>
                  <div className="product-card-top">
                    <span>DEMO</span>
                    <small>{item.family}</small>
                  </div>
                  <h4>{item.name}</h4>
                  <p>{item.summary}</p>
                  <div className="tag-row">
                    {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </article>
              ))}
            </div>
            <p className="concept-note">所有型号与参数均为界面演示用途，不指向任何真实厂商或在售产品。</p>
          </aside>
        </div>
      </section>

      <section className="project-note">
        <p className="section-label">ABOUT THIS PROJECT</p>
        <div>
          <h2>不仅是图，<br />而是一套信息体验。</h2>
          <p>项目将复杂架构拆解为可探索的视觉层级：场景导航帮助定位，颜色编码建立认知，模块详情承接产品信息。所有系统名称、拓扑、文案和概念型号均为原创演示内容。</p>
        </div>
        <div className="project-tags"><span>React</span><span>TypeScript</span><span>Responsive UI</span><span>Accessibility</span></div>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>FluxCanvas</span></div>
        <p>原创交互式系统架构作品集 · 仅作设计与开发能力展示</p>
        <span>© 2026 Shayne</span>
      </footer>
    </main>
  );
}
