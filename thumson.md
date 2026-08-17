# Thumson

这是一份给 FIRE planner 的架构备忘录，目的是把现在这套 dashboard 变得更稳、更容易维护。

## 目标

- 让数据、计算、渲染分层
- 让 assumption 有单一来源
- 让 dashboard 的 HTML 只负责骨架和资源引用
- 让问答版和主 dashboard 尽量共享同一套模型口径

## 推荐分层

### 1. Data layer

负责所有稳定的数据和表格来源：

- 城市成本表
- 税率参考表
- 孩子与教育表
- 住房假设表
- 其他固定默认值

要求：

- 只放静态数据或结构化配置
- 不写 DOM
- 不写渲染
- 不做事件处理

### 2. Calculation engine

负责所有纯计算：

- 家庭口径
- 年度支出
- 税后收入
- 资产增长
- FIRE 目标
- 当前路径 / 达标路径
- 房贷和房屋净值
- 年度明细行数据

要求：

- 输入是 state，输出是结果
- 尽量写成 pure functions
- 不直接读写页面元素
- 不负责样式和布局

### 3. UI rendering

负责把计算结果画到页面上：

- KPI 卡片
- 图表
- 明细表
- tooltip
- FAQ
- 语言切换
- tab 切换

要求：

- 只负责展示和交互
- 不在 UI 层里写太多业务规则
- 复杂计算先交给 engine

### 4. Dashboard shell

HTML 只保留：

- 页面结构
- CSS 引用
- JS 引用
- 少量语义化容器

这样以后想改布局、换图表或换问答版，都不会被超长内联脚本绑住。

## 当前文件职责

- `index.html`：主 dashboard 外壳
- `dashboard-app.js`：主 dashboard 的渲染和交互脚本
- `fire-model.js`：问答版共享的轻量模型和计算层
- `questionnaire.html` / `questionnaire.js` / `questionnaire.css`：手机问答版
- `ASSUMPTIONS.md`：人能读的主假设说明
- `city_food_spend_model.csv` / `city_housing_model.csv` / `kids_education_model.csv` / `tax_assumptions.json`：结构化数据源

## 稳定性原则

- 一份数据只在一个地方写
- 一个口径只在一个地方算
- tooltip 和 README 必须跟着模型一起改
- 如果一个按钮会影响结果，先检查它有没有真正连到核心计算
- 如果一个值只是展示用，就不要让它反过来改核心逻辑

## 后续建议

- 继续把 `dashboard-app.js` 里的计算段再拆成更小的核心模块
- 把 data / engine / renderer 之间的边界再明确一点
- 给 CSV / JSON 增加更严格的字段校验
- 如果以后要做新页面，优先复用 engine，不要复制计算逻辑
