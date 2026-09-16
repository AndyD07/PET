# 尾巴小食

原生 HTML / CSS / JavaScript 宠物零食演示商店。无需构建或安装项目依赖。

## 预览

可直接打开 `dist/index.html`；推荐在此目录执行 `python -m http.server 4173 --directory dist`，访问 `http://localhost:4173`，以稳定使用浏览器本地保存。

## 内容与功能

- 在 `dist/store.js` 编辑六款商品的数据，价格以分为单位。
- 在 `dist/styles.css` 调整配色与响应式布局。
- `dist/assets/hero.png` 为场景示意图，`treats.png` 为三列两行商品图集。
- 猫狗筛选包含通用商品；购物车数量上限为每款 99 件。
- 购物车保存在当前浏览器，无后端、真实订单或支付。
- 图像为 AI 生成，品牌、商品、价格、销量、活动与服务说明均为演示。

## 验证

执行 `node --test tests/cart.test.cjs` 检查金额、重复加购、移除和存储数据恢复。

可选浏览器验收：测试环境安装 Playwright 并有 Chrome 后，启动上述预览，再执行 `node tests/browser.cjs`。它检查四档宽度、筛选、购物车、弹窗与图片失效占位，截图写入忽略版本控制的 `qa/`。
