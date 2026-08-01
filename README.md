# 交互式系统框图

以两套完整工程系统为核心的交互式 SVG 前端：空调室内机与咖啡机。每张图使用英文工程标注，展开电源、传感、模拟前端、数字处理、通信、人机界面、功率级、执行器和反馈链路。

点击浅蓝色功能模块后，右侧会显示该模块对应的 TI 公开产品，并提供 TI 官方产品页入口。当前框图也可以直接下载为 SVG。

## 本地运行

```bash
npm install
npm run dev
```

## 检查与 Pages 构建

```bash
npm test
npm run build:pages
```

## 内容与权利说明

模块与产品信息参考 TI 官方公开应用页面：

- [空调室内机](https://www.ti.com.cn/solution/cn/air-conditioner-indoor-unit?variantid=34874&subsystemid=16093)
- [咖啡机](https://www.ti.com/solution/coffee-machine)

本项目不是 TI 官方页面。框图的拓扑、坐标、视觉样式与前端交互均为重新设计，没有复制 TI 的 SVG 文件或网页代码。产品名称及相关商标归其权利人所有。
