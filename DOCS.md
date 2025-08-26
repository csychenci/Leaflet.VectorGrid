# 文档生成指南

## TypeDoc 现代化文档系统

本项目已配置 TypeDoc 来生成现代化的 API 文档，替代原有的 `gobble-leafdoc` 系统。

### 快速开始

```bash
# 生成文档
npm run docs:build

# 启动本地预览服务器
npm run docs:serve

# 一键生成并预览文档
npm run docs:dev

# 监听文件变化并自动重新生成文档
npm run docs:watch

# 清理生成的文档
npm run docs:clean
```

### 文档结构

- **输入文件**: `src/index.d.ts` - TypeScript 类型定义文件
- **输出目录**: `docs/api/` - 生成的 HTML 文档
- **配置文件**: `typedoc.json` - TypeDoc 配置
- **TypeScript 配置**: `tsconfig.json` - 编译选项

### 主要特性

✅ **现代化 UI**: 基于 TypeDoc 默认主题，响应式设计  
✅ **完整的类型支持**: 自动解析 TypeScript 类型定义  
✅ **搜索功能**: 内置全文搜索  
✅ **导航链接**: 集成 GitHub 和 NPM 链接  
✅ **层次结构**: 清晰的类、接口、方法组织  
✅ **本地预览**: 内置开发服务器  

### 与旧系统对比

| 特性 | 旧系统 (gobble-leafdoc) | 新系统 (TypeDoc) |
|------|------------------------|------------------|
| 构建工具 | Gobble (已过时) | TypeDoc (现代化) |
| 类型支持 | 有限 | 完整 TypeScript 支持 |
| 主题 | 自定义 Handlebars | 现代化默认主题 |
| 搜索 | 无 | 内置全文搜索 |
| 维护性 | 依赖过时包 | 活跃维护 |

### 配置说明

**typedoc.json** 主要配置项：
- `entryPoints`: 文档入口文件
- `out`: 输出目录
- `theme`: 主题选择
- `navigationLinks`: 导航链接
- `excludePrivate`: 排除私有成员

### 自定义配置

如需自定义文档样式或添加更多功能，可以：

1. 修改 `typedoc.json` 配置
2. 安装 TypeDoc 主题插件
3. 添加自定义 CSS 样式
4. 配置更多导航链接

### 部署建议

生成的文档可以部署到：
- GitHub Pages
- Netlify
- Vercel
- 任何静态文件托管服务

只需将 `docs/api/` 目录的内容上传即可。