# 7yewh.github.io

个人作品集网站，Astro 构建，GitHub Pages 托管。https://7yewh.github.io

## 日常操作

```bash
npm run dev       # 本地预览 http://localhost:4321
npm run build     # 构建到 dist/
git push          # 推送后 GitHub Actions 自动构建并发布
```

## 添加内容

| 内容 | 位置 | 说明 |
|------|------|------|
| 项目 | `src/content/projects/{zh,en}/<slug>.md` | 中英两份同名文件，frontmatter 见已有文件 |
| 博客 | `src/content/blog/{zh,en}/<slug>.md` | 同上，`date` 决定排序 |
| 关于页 | `src/content/about/{zh,en}.md` + `src/data/skills.ts` | |
| 图片 | `public/images/` | 在 frontmatter 里用 `cover: /images/xxx.jpg` 引用 |
| 界面文案 | `src/i18n/ui.ts` | 导航、首页标题等 |

frontmatter 里 `draft: true` 的条目不会出现在网站上。
