# 语言包加载器

启用 `@fairyonthetree/pirate-locale` 后，主题整合包可以通过补丁给 `locale-pack-loader` 提供一份语言包，并给 DSH 的 `locale` 行设置语言偏好。

```yaml
- id: locale-pack-loader
  config:
    pack:
      id: zh-fantasy
      label: 简体中文 · 奇幻
      fallback: zh
      dictionaries:
        sidebar:
          session.new: 新冒险
          session.new.label: 新冒险
        conversation:
          hero.headline: 踏上旅途
- id: locale
  config:
    preference: zh-fantasy
```

加载器从宿主读取配置，按命名空间注册词典。清除 `pack` 或停用加载器后，词典与语言定义一并注销。加载器只读取配置。语言选择由 DSH 处理，优先级更高的个人偏好仍然有效。请在整合包列表中把加载器排在提供词典的主题前面。多个主题同时配置时，靠后的整合包胜出。
