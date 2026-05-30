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

公开地址（自定义域名）：**https://xiaotu.com/**  
备用：**https://laurarararararara.github.io/economyStudy/**（需在构建时设置 `GITHUB_PAGES_BASE=/economyStudy/`）

1. [Settings → Pages](https://github.com/laurarararararara/economyStudy/settings/pages) → Source 选 **GitHub Actions**
2. 自定义域名填 `xiaotu.com` 后，到**域名注册商**配置 DNS（见下）
3. DNS 生效且 Enforce HTTPS 可用后，即可访问

### 自定义域名 DNS（在阿里云/腾讯云/Cloudflare 等）

| 类型 | 主机记录 | 值 |
|------|----------|-----|
| A | @ | `185.199.108.153` |
| A | @ | `185.199.109.153` |
| A | @ | `185.199.110.153` |
| A | @ | `185.199.111.153` |
| CNAME | www | `laurarararararara.github.io` |

保存后等待 10 分钟～48 小时解析。在 Pages 设置里应出现 **DNS check successful**。

## 项目结构

```
src/
  data/book.ts           # 章节与子篇目录
  data/lectures/        # 118 讲正文、对话、可选原文
  pages/                # 首页、章节、讲次、案例
  components/           # 布局、对话阅读、B 站嵌入
```

## 从 PDF 导入书中原文

将《薛兆丰经济学讲义》PDF 放在 `~/Downloads/薛兆丰经济学讲义.pdf`（或修改 `scripts/extract-pdf-originals.py` 中的路径），然后：

```bash
npm run extract:pdf
```

会生成 `src/data/lectures/pdf-originals.json`，网站「原文」标签将显示电子书正文。仅供个人学习，请勿公开传播全书内容。

批量重生成 ch2–ch10 通俗解读：`node scripts/gen-lectures.mjs`

## 说明

内容结构参考《薛兆丰经济学讲义》中信出版社目录，仅供个人学习交流。
