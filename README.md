# 薛兆丰《经济学讲义》读书网站

基于 Vite + React + TypeScript 的前端读书站点，完整列出全书 10 章、子篇与 118 讲目录。

## 功能

- **全书目录**：十大章节卡片，含子篇数量、讲数、故事数量
- **章节详情**：子篇标题 + 每一讲列表
- **每一讲**：原文 · 通俗文字解读 · 对话阅读 ·（部分）B 站延伸
- **案例故事**：经典讲次快捷入口

## 运行

```bash
cd xue-economics-reader
npm install
npm run dev
```

浏览器打开终端提示的本地地址（默认 `http://localhost:5173`）。

## 构建

```bash
npm run build
npm run preview
```

## 在线访问（GitHub Pages）

公开地址：**https://laurarararararara.github.io/economyStudy/**

1. 打开仓库 [Settings → Pages](https://github.com/laurarararararara/economyStudy/settings/pages)
2. **Build and deployment → Source** 选 **GitHub Actions**（不要选 “Deploy from a branch / main / root”，那样只会发布源码，网站无法运行）
3. 推送 `main` 后会自动运行 `.github/workflows/deploy-pages.yml`，约 1–2 分钟部署完成
4. Pages 设置页顶部会出现绿色提示 “Your site is live at …”

## 项目结构

```
src/
  data/book.ts           # 章节与子篇目录
  data/lectures/        # 118 讲正文、对话、可选原文
  pages/                # 首页、章节、讲次、案例
  components/           # 布局、对话阅读、B 站嵌入
```

## 补充书中原文

讲次数据里可为某一讲单独设置 `original` 字段；未设置时「原文」页会显示该讲的 `body` 正文。在 `src/data/lectures/ch*.ts` 的 `qa()` / `mk()` 中增加最后一个参数即可，例如：

```ts
qa('001', '战俘营里的经济组织', body, takeaway, keyPoints, exchanges, undefined, '书中原文段落……'),
```

批量重生成 ch2–ch10：`node scripts/gen-lectures.mjs`

## 说明

内容结构参考《薛兆丰经济学讲义》中信出版社目录，仅供个人学习交流。
