# outflow-utsz-map

[Outflow](https://github.com/tech-cats/outflow) 插件：深圳大学城互动地图。

- 自制底图上的地点标记，按分类筛选、按名称或楼栋编号搜索
- 地点详情：实拍照片、说明、入口提示、教学楼侧后门的门禁办理说明
- 地点链接可分享（`/map?poi=<id>`）
- 编辑及以上可以在线新增、修改、移动、删除地点，上传实拍照片
- 攻略可以关联地点：攻略页底部显示「相关地点」，地点详情里列出「相关攻略」（只显示读者有权限看到的文档）

## 安装

在 Outflow 仓库中：

```bash
git clone <本仓库地址> plugins/utsz-map
pnpm install      # 或 pnpm plugins，重新生成插件注册表
```

之后照常构建、部署 Outflow 即可。首次打开地图时，内置的地点数据会写入数据库，此后以数据库为准。

## 目录

```
outflow.plugin.json   插件清单（id、顶栏入口、入口文件、静态资源目录）
src/server.ts         接口：地点增删改查、文档与地点的关联；阅读页中的「相关地点」
src/web.tsx           前端入口：/map 页面与编辑页中的「相关地点」面板
src/data.ts           底图、分类、楼栋编号、文字标注，以及地点的初始数据
public/               底图与实拍照片（对外路径 /plugins/utsz-map/...）
```

## 开发约定

- 遵循 Outflow 的插件约定：不能有自己的 npm 依赖，只能使用宿主提供的 React 与 `@outflow/sdk`；服务端只能 `import type`
- 样式类名统一使用 `um-` 前缀，颜色尽量使用宿主的 CSS 变量，以适配深浅色主题
- 类型检查随 Outflow 的 `pnpm typecheck` 一起进行
- 底图坐标为相对底图宽高的百分比；更换底图时需要同步校准地点坐标

## 许可

MIT。图标参考 [Lucide](https://lucide.dev)（ISC）。
