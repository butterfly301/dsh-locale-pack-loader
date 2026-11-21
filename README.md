# 语言包加载器

启用 `dsh-locale-pack-loader` 后，主题整合包可以通过补丁给 `locale-pack-loader` 提供一份语言包：按命名空间注册词典，并新增一个可选语言。选用哪种语言由主题通过 DSH 的 `locale` 行单独设置，不属于加载器的职责。

```yaml
- id: locale-pack-loader
  config:
    pack:
      id: zh-example
      label: 示例中文
      fallback: zh
      dictionaries:
        sidebar:
          session.new: 新会话
          session.new.label: 新会话
        conversation:
          hero.headline: 开始对话
- id: locale
  config:
    preference: zh-example
```

加载器从宿主读取配置，按命名空间注册词典，并注册语言定义（id、名称、回退语言）。清除 `pack` 或停用加载器后，词典与语言定义一并注销。加载器只读取配置，`pack` 声明为 volatile，不写回任何用户设置。
