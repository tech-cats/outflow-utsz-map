# AGENTS.md

这是一个 Outflow 插件，需要放在 Outflow 仓库的 `plugins/<name>` 下才能运行和做类型检查（在 Outflow 根目录执行 `pnpm typecheck`、`pnpm build`）。

- 不要添加 npm 依赖：前端只能用宿主提供的 React 和 `@outflow/sdk/web`，服务端只能 `import type` 自 `@outflow/sdk/server`
- 地点数据以数据库为准；`src/data.ts` 中的 `seedPois` 只在首次访问时写入，修改它不会影响已上线的站点
- 读取文档相关的数据前必须经过 `docs.access` / `docs.readable` 的权限检查
- 本仓库的实拍照片不含 GPS 等位置元数据，新增照片时也请先去除
