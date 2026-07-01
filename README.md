# Figma Clone - 协作式设计工具

## 项目概述

这是一个基于 Next.js 和 Fabric.js 构建的现代化协作式设计工具，类似于 Figma 的在线设计平台。项目支持实时协作、多用户光标、形状绘制、图层管理等核心功能。

## 🎯 核心功能

### 🎨 设计工具
- **基础形状绘制**: 矩形、圆形、三角形、线条等
- **自由绘制**: 手绘路径和形状
- **文本编辑**: 支持字体、大小、粗细调整
- **颜色控制**: 填充色和边框色独立设置
- **图像上传**: 支持拖拽上传图片到画布

### 👥 实时协作
- **多用户光标**: 实时显示所有参与者的鼠标位置
- **光标聊天**: 点击其他用户光标可发送消息
- **表情反应**: 支持发送表情动画到画布特定位置
- **LiveCursors**: 不同颜色区分不同用户

### 📋 图层管理
- **左侧边栏**: 显示所有图层的列表
- **图层选择**: 点击图层可选中对应元素
- **收起展开**: 侧边栏支持收起以扩大画布空间
- **图标显示**: 每个图层显示对应的形状图标

### ⚙️ 属性面板
- **右侧边栏**: 设计属性调整面板
- **尺寸控制**: 精确调整选中元素的宽度和高度
- **文本属性**: 字体族、大小、粗细设置
- **颜色选择**: 主色和边框色选择器
- **导出功能**: 支持导出设计作品

### ⌨️ 快捷键支持
- **复制粘贴**: Ctrl+C/V 复制和粘贴元素
- **剪切功能**: Ctrl+X 剪切选中元素
- **删除操作**: Delete/Backspace 删除选中元素
- **撤销重做**: Ctrl+Z/Y 撤销和重做操作
- **快捷切换**: "/" 键打开聊天，"e" 键打开表情选择器

### 🎭 交互功能
- **选中状态**: 支持单选和多选元素
- **拖拽移动**: 鼠标拖拽移动元素位置
- **缩放旋转**: 支持元素的缩放和旋转操作
- **智能对齐**: 元素拖拽时的对齐辅助线
- **响应式画布**: 侧边栏收起时画布自动扩大

## 🛠️ 技术栈

### 前端框架
- **Next.js 16**: React 全栈框架，支持 SSR 和 App Router
- **TypeScript**: 类型安全的 JavaScript 超集
- **Tailwind CSS**: 原子化 CSS 框架，快速样式开发
- **Lucide Icons**: 现代化图标库

### 画布引擎
- **Fabric.js v7**: 强大的 HTML5 Canvas 库
- **Canvas 操作**: 形状创建、变换、渲染
- **事件处理**: 完整的鼠标和键盘事件支持
- **性能优化**: 防抖操作和智能重渲染

### 实时协作
- **Liveblocks**: 专业的实时协作平台
- **WebSocket 通信**: 低延迟的数据同步
- **状态管理**: 实时用户状态和画布状态同步
- **冲突解决**: 多用户同时编辑的冲突处理

### 开发工具
- **ESLint**: 代码质量和风格检查
- **TypeScript 严格模式**: 类型安全保障
- **React Hooks**: 现代化状态管理
- **组件化设计**: 可复用的模块化架构

## 📁 项目结构

```
figma-clone/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主页面组件
│   └── layout.tsx          # 根布局组件
├── components/              # React 组件库
│   ├── Live.tsx           # 主画布组件
│   ├── LeftSidebar.tsx     # 左侧图层面板
│   ├── RightSidebar.tsx    # 右侧属性面板
│   ├── Navbar.tsx          # 顶部导航栏
│   ├── cursor/             # 光标相关组件
│   ├── reaction/           # 表情反应组件
│   ├── settings/           # 属性设置组件
│   └── comments/           # 评论功能组件
├── lib/                   # 工具函数库
│   ├── canvas.ts           # Fabric.js 画布操作
│   ├── shapes.ts           # 形状创建工具
│   └── key-events.ts       # 键盘事件处理
├── types/                  # TypeScript 类型定义
├── hooks/                  # 自定义 React Hooks
└── constants/              # 项目常量定义
```

## 🎨 设计特色

### 界面设计
- **暗色主题**: 专业的深色界面设计
- **绿色强调**: 使用绿色作为主要强调色
- **圆角设计**: 现代化的圆角卡片和按钮
- **平滑动画**: 300ms 的过渡动画效果
- **响应式布局**: 适配不同屏幕尺寸

### 用户体验
- **直观操作**: 拖拽式交互，学习成本低
- **实时反馈**: 所有操作都有即时的视觉反馈
- **快捷操作**: 丰富的键盘快捷键支持
- **智能提示**: 工具提示和操作引导
- **无缝协作**: 流畅的多用户协作体验

## 🚀 核心亮点

### 1. 实时协作引擎
- 基于 Liveblocks 的专业级协作解决方案
- 支持数十个用户同时在线编辑
- 毫秒级的操作同步延迟
- 丰富的协作交互功能

### 2. 专业设计工具
- 完整的矢量形状工具集
- 精确的属性控制面板
- 专业的图层管理系统
- 强大的文本编辑功能

### 3. 现代化架构
- 组件化的 React 18 架构
- 类型安全的 TypeScript 开发
- 高性能的 Canvas 渲染
- 可扩展的插件化设计

### 4. 优秀的用户体验
- 直观的拖拽式操作
- 智能的布局自适应
- 丰富的快捷键支持
- 流畅的动画过渡效果

## 🎯 应用场景

### 团队协作
- **UI/UX 设计**: 团队共同设计界面原型
- **图形设计**: 多人协作完成平面设计
- **原型制作**: 快速构建交互原型
- **设计评审**: 实时讨论和修改设计

### 个人使用
- **独立设计**: 个人设计作品创作
- **快速原型**: 快速验证设计想法
- **素材制作**: 创建可复用的设计素材
- **学习工具**: 学习设计原理和工具使用

## 📈 技术优势

### 性能优化
- **Canvas 优化**: 智能重渲染和区域更新
- **防抖处理**: 减少不必要的计算和网络请求
- **内存管理**: 及时清理不需要的对象和事件
- **懒加载**: 按需加载组件和资源

### 可维护性
- **模块化设计**: 清晰的代码组织结构
- **类型安全**: TypeScript 提供完整类型保护
- **组件复用**: 高度可复用的组件设计
- **文档完善**: 详细的代码注释和文档

### 可扩展性
- **插件化架构**: 易于添加新的工具和功能
- **配置驱动**: 通过配置文件控制功能开关
- **API 设计**: 清晰的组件接口设计
- **状态管理**: 可预测的状态更新机制

## 🔧 开发环境

### 运行环境
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run lint         # 代码质量检查
npm run type-check   # TypeScript 类型检查
```

### 技术要求
- Node.js 18+
- Next.js 16+
- React 18+
- TypeScript 5+
- 现代浏览器支持

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
