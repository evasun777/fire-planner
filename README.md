# FIRE 财务自由规划器

一个可以本地运行、也可以直接放到 GitHub Pages 上的 FIRE 规划 dashboard。

它的目标不是制造“财富自由神话”，而是把抽象焦虑拆成可以执行的路径：先确认你想要的生活，再把时间、地点、家庭、住房、孩子、收入和支出一项项落到数字上，最后看自己和目标之间到底差多少。

## 在线版本

- [https://evasun777.github.io/fire-planner/](https://evasun777.github.io/fire-planner/)

## 项目主旨

这个项目希望帮助你：

- 先把“我真正想要什么样的生活”说清楚
- 再把生活选择翻译成现金流、资产和时间轴
- 看清楚当前路径和目标路径之间的差距
- 让 FIRE 变成一个可讨论、可调整、可落地的规划问题，而不是纯靠想象的焦虑问题

换句话说，它想做的是：

- 少一点幻想
- 少一点“我以后应该会很自由吧”的模糊感
- 多一点对自己路径的实打实判断

## 这是什么

- 一个单页 HTML dashboard
- 目前主页面已经拆成 `index.html` + `dashboard-app.js`：
  - `index.html` 负责页面骨架、样式和资源引用
  - `dashboard-app.js` 负责主 dashboard 的渲染、交互和计算调用
- 支持中文 / English / 中英双语
- 可以切换个人口径和双成人家庭
- 可以切换当前路径和达标路径
- 会显示收入、支出、资产、房屋净值、财富 gap、年度明细和长期路径
- 还提供一个手机友好的问答版：[`questionnaire.html`](./questionnaire.html)

## 代码结构

这份项目现在尽量按下面的思路拆：

- `data`
  - 城市、教育、住房、税务等结构化假设
  - CSV / JSON 作为可校准的数据源
- `calculation engine`
  - 负责把输入 state 转成支出、资产、财富 gap、FIRE 年龄
  - 尽量保持纯函数
- `UI rendering`
  - 负责把结果渲染成卡片、图表、tooltip 和 FAQ
  - 不直接承载复杂业务规则
- `dashboard shell`
  - `index.html` 只保留骨架
  - `dashboard-app.js` 承担主 dashboard 行为
- `mobile questionnaire`
  - `questionnaire.html` / `questionnaire.js` / `questionnaire.css`
  - 用同一套核心口径做轻量问答版

## 核心假设摘要

下面是当前版本最重要的规划口径，详细版都汇总在 [`ASSUMPTIONS.md`](./ASSUMPTIONS.md)：

### 1. Household 口径

- 有两种 household 口径：
  - `个人口径`：1 个成人，只算 1 份收入
  - `双成人家庭`：2 个成人，算 2 份收入
- 双成人家庭不会把全部支出简单乘 2：
  - 住房按家庭规模升级
  - 第二位成人只增加边际成本，例如餐饮、衣物、交通和日常生活
  - 医疗已经并入生活费，不再在顶层支出里单独重复计算
- 卧室数按 `成人数 + 孩子数` 估算

### 2. 时间、地点与年度支出

- 当前年龄范围：18-70 岁
- 预期退休 / 工作可选年龄范围：35-80 岁
- 退休 / 工作可选年龄不能早于当前年龄
- 年度模拟从当前年龄开始，并至少延伸到 80 岁
- 如果选择 `回国`，模型会在 `fiAge` 这个年龄切换到退休地点成本
- 如果选择 `留在美国`，模型不会切换到中国城市成本
- 退休前的 living / housing / travel / 家人支持等费用，会按当前地点和城市系数计算

### 3. 当前资产、收入与税

- 当前可投资资产输入范围：`0 - 10M`
- 当前税前年收入输入范围：`0 - 1.5M`
- 第二位成人税前年收入输入范围：`0 - 1.5M`
- 报税州可选多个常见州
- 税率计算方式有两种：
  - `自动估算`
  - `手动有效税率`
- 自动税率估算的规划口径：
  - Federal 使用当前规划税档与 standard deduction
  - Payroll tax 包括 Social Security、Medicare、Additional Medicare
  - California 使用分档估算
  - 其他州使用规划级近似州所得税，不是逐州报税引擎
- 无州个人所得税州：
  - TX / WA / FL 按州所得税 0 处理
- 未计入的个性化项目：
  - 401(k)
  - HSA
  - itemized deductions
  - AMT
  - NIIT
  - capital gains timing
  - RSU timing
  - 其他更细的税务优化项目

### 4. 退休后的收入与提取

- `退休后劳动收入保留比例` 是可调项
  - `0%` = 完全退休
  - 例如 `25%` 可代表兼职、教学、咨询或小生意收入
- 这个比例从退休年龄后的下一年开始生效
- 退休后资产提取不是手动输入项
  - 模型会自动根据 `年度支出 - 被动收入 - 保留的劳动收入` 计算需要从投资账户补的现金流
  - 如果被动收入已经覆盖支出，提取就是 `0`
- 资产更新的核心口径是：
  - `年初资产 + 投资收益 + 税后劳动收入 - 支出`

### 5. 生活方式

- 生活方式有三档：
  - `节制`
  - `舒适`
  - `宽裕`
- 当前默认乘数：
  - 节制：`0.82x`
  - 舒适：`1.00x`
  - 宽裕：`1.28x`
- 这个乘数目前只作用在生活费上
  - 医疗已经并入生活费
  - 住房、旅行、父母 / 家人支持、孩子支出不会被这个乘数自动放大
- 当前生活费基准是按去年 spending snapshot 校准后的版本
  - 默认总额约 `30k/年`
  - 这套默认拆分来自更接近真实全年支出的规划型校准
  - 如果选择 `租房`，住房部分会切换成对应城市的年度租金，而不是房贷现金流
  - 如果选择 `买房`，住房部分才会按房贷、首付和持有成本去算

### 6. 孩子与教育

- 孩子数量可选：`0 / 1 / 2 / 3 / 4 / 5`
- 0-5 岁育儿方式：
  - `Daycare为主`
  - `父母+Nanny+Daycare`
  - `Nanny为主`
- 教育口径分为：
  - 美国阶段学校
  - 回国后学校
- 美国阶段学校：
  - `优质公立`
  - `私立`
- 回国后学校：
  - `国际/双语`
  - `中国公立`
  - `继续留美`
- 如果孩子数量是 0，相关学校与育儿选项会隐藏
- 孩子支出只在对应年龄段计入，不会全程按最高档重复计算
- `kids_education_model.csv` 作为孩子与教育的结构化参考文件

### 7. 住房与房贷

- 住房模式：
  - `租房`
  - `买房`
- 买房模式默认：
  - 如果当前地点和退休地点相同，就现在买
  - 如果当前地点和退休地点不同，就在搬到退休地点那一年开始买房
- 买房参数可调：
  - 首付比例
  - 购房价格
  - 房贷利率
  - 房贷年限
  - 房产税 + 保险 + 维护
- 购房价格默认值会先按当前城市、当前家庭口径对应的住房成本假设自动填入
- 买房计算口径：
  - 首付 = 房价 × 首付比例
  - 初始房贷 = 房价 × (1 - 首付比例)
  - 之后按等额本息逐年计算本金与利息
  - 房屋净值 = 房价 - 剩余房贷余额
- 退休目标不会把整套房价重复算一遍
  - 长期永久支出里只保留房产税 / 保险 / 维护
  - 尚未还完的房贷只按剩余付款现值计一次
  - 总财富展示只加入退休年龄时已经形成的房屋净值

### 8. 投资回报

- 长期实际投资回报默认 `3.5%`
- 这是实际购买力口径，不是名义收益
- 模型把长期回报当成 deterministic baseline
  - 它是规划假设，不代表每年市场都会稳定给出同样回报

### 9. 总财富、FIRE 和资金缺口

- 退休时所需可投资资产 =
  - 永久性年度支出 ÷ `4%`
  - + 孩子剩余支出现值
  - + 退休后剩余房贷付款现值
- 退休时所需总财富 =
  - 所需可投资资产
  - + 房产预算 / 房屋净值相关部分
- 财富 Gap 的定义：
  - `退休年龄预计总财富 - 退休时所需总财富`
  - 正数表示超过目标
  - 负数表示仍有缺口

### 10. Current path 与 Target path

- 页面顶部和图表里有两种 projection：
  - `当前路径`
  - `达标路径`
- `当前路径`：
  - 使用当前税前年收入和当前支出做 projection
  - 用来观察资产会如何随时间变化
- `达标路径`：
  - 先反推达到 FIRE 所需的税前年收入
  - 再用这个收入做 projection
- 年度图表里，`当前路径的财富自由年龄` 指的是：
  - 当前路径第一次达到对应年龄的总财富门槛的那一年
- 页面 summary 里也会单独解释 FIRE 的 operational definition：
  - 被动收入加上任何保留的劳动收入，应该足以覆盖当年的支出

### 11. 城市规划型假设

- 固定生活费的口径：
  - 先用湾区年度基础生活费作为基准
  - 再乘以城市系数
  - 之后按家庭人数拆成 food / goods / insurance / medical / misc
  - food 和 goods 主要按人头算
  - insurance 和 medical 主要按成人数算
  - medical 已并入生活费，不再在顶层单独重复
- 当前湾区基础生活费默认约：
  - `$30,000/年`
  - 这套默认拆分来自去年 spending snapshot 的规划型校准
- `city_food_spend_model.csv`
  - 作为按人头展示的单人 food 样本表
  - 口径和页面里的 `$30/day/person` floor 对齐
- `city_housing_model.csv`
  - 作为城市住房成本假设表
- `ASSUMPTIONS.md`
  - 作为主假设总说明

## 怎么本地打开

如果你已经在项目目录里，可以直接起一个静态服务器：

```bash
python3 -m http.server 8000
```

然后打开：

- `http://127.0.0.1:8000/index.html`

## 上 GitHub 之后怎么 host

把这个仓库启用 GitHub Pages 即可：

1. 打开仓库的 `Settings`
2. 进入 `Pages`
3. 在 `Build and deployment` 里选择 `Deploy from a branch`
4. `Branch` 选 `main`
5. `Folder` 选 `/ (root)`
6. 保存后等待部署完成

部署成功后，页面会有一个类似下面的公开地址：

- `https://<your-username>.github.io/<repo-name>/`

## 相关文件

- [`index.html`](./index.html): 主页面
- [`dashboard-app.js`](./dashboard-app.js): 主 dashboard 的渲染和交互逻辑
- [`questionnaire.html`](./questionnaire.html): 手机问答版入口
- [`fire-model.js`](./fire-model.js): 问答页共享的模型和计算层
- [`questionnaire.js`](./questionnaire.js): 问答页交互逻辑
- [`questionnaire.css`](./questionnaire.css): 问答页样式
- [`thumson.md`](./thumson.md): 架构备忘录和分层说明
- [`ASSUMPTIONS.md`](./ASSUMPTIONS.md): 当前模型假设和城市资源说明
- [`city_food_spend_model.csv`](./city_food_spend_model.csv): 城市吃饭成本样本
- [`city_housing_model.csv`](./city_housing_model.csv): 城市住房成本假设
- [`kids_education_model.csv`](./kids_education_model.csv): 孩子与教育的结构化规划假设
- [`tax_assumptions.json`](./tax_assumptions.json): 税率估算的结构化参考数据

## 免责声明

- 这个项目仅用于个人规划和参考，不构成投资建议、税务建议、法律建议或任何形式的专业承诺。
- 页面里的数值是规划型假设，不是正式报税结果，也不是市场收益保证。
- 实际税负、医疗支出、教育成本、住房成本和投资回报都可能因人、因州、因城市、因时间而变化。
- 如果你打算把结果用于重要财务决策，请再用真实账单、专业意见和最新数据复核一次。

## 备注

- 如果你改了页面逻辑，最好同步更新 [`ASSUMPTIONS.md`](./ASSUMPTIONS.md)，这样 tooltip、README 和文档会保持一致。
- 如果你想把这个项目进一步做成更适合手机的问答版，可以优先参考 [`questionnaire.html`](./questionnaire.html)。
