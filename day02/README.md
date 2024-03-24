## 02-任务调度器& fiber 架构

### FAQ
- 大量 dom 树渲染造成渲染卡顿
  - 借助 [requestIdleCallback](https://mdn.io/zh-CN/requestidlecallback) 分帧处理
- 如何实现每次任务只渲染几个节点，下次继续之前的位置处理
  - 将树结构转换为链表结构

### 收获
- 初步了解到 [requestIdleCallback](https://mdn.io/zh-CN/requestidlecallback)
- 树结构转换链表结构思路
