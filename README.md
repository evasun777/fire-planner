# FIRE 财务自由规划器

一个可以本地运行、也可以直接放到 GitHub Pages 上的 FIRE 规划 dashboard。

## 在线版本

- [https://evasun777.github.io/fire-planner/](https://evasun777.github.io/fire-planner/)

## 这是什么

- 单页 HTML dashboard
- 支持中 / 英 / 中英双语
- 可以切换个人口径和双成人家庭
- 可以切换当前路径和达标路径
- 会显示收入、支出、资产、房屋净值、财富 gap 和年度明细

## 本地打开

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
- [`questionnaire.html`](./questionnaire.html): 手机问答版入口
- [`fire-model.js`](./fire-model.js): 问答页共享的模型和计算层
- [`questionnaire.js`](./questionnaire.js): 问答页交互逻辑
- [`questionnaire.css`](./questionnaire.css): 问答页样式
- [`ASSUMPTIONS.md`](./ASSUMPTIONS.md): 当前模型假设和城市资源说明

## 备注

- 这个项目的很多数值是规划型假设，不是正式税务申报或理财建议。
- 如果你改了页面逻辑，最好同步更新 `ASSUMPTIONS.md`，这样 tooltip 和文档会保持一致。
