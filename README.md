# 语言包加载器

一个通用的 DSH web 客户端插件，按配置注册若干语言及其命名空间词典。语言 ID、名称、回退语言和词典内容全部来自配置，插件本身不含任何语言定义。选用哪种语言由 DSH 的 `locale` 设置行决定，不属于加载器的职责。

此包是 [`dsh-pirate-mode`](https://github.com/butterfly301/dsh-pirate-mode) 的组件，也可以单独安装使用。

## 独立安装

```bash
dsh plugin --profile desktop add dsh-locale-pack-loader
```

默认没有语言包，装完不注册任何语言；按下方片段提供 `packs` 后生效。

## 配置

通过补丁给 `locale-pack-loader` 提供一个或多个语言包。`packs` 是数组，每一项注册一种语言；`pack` 是单语言写法，保留兼容。两者会合并，按 ID 去重。

```yaml
- id: locale-pack-loader
  config:
    packs:
      - id: zh-example
        label: 示例中文
        fallback: zh
        dictionaries:
          sidebar:
            session.new: 新会话
            session.new.label: 新会话
      - id: en-example
        label: Example English
        fallback: en
        dictionaries:
          sidebar:
            session.new: New chat
- id: locale
  config:
    preference: zh-example
```

新增语言只需在 `packs` 里加一项——语言 ID 完全由配置决定，代码不写死任何语言。

| 字段 | 类型 | 含义 |
|---|---|---|
| `packs[].id` | `string` | 语言 ID（如 `zh`、`en`、`xx-example`） |
| `packs[].label` | `string` | 语言显示名 |
| `packs[].fallback` | `string` | 回退语言 ID |
| `packs[].dictionaries` | `object` | 命名空间 → 键 → 译文 |

加载器从宿主读取配置，按命名空间注册词典，并注册语言定义（ID、名称、回退语言）。清除配置或停用加载器后，词典与语言定义一并注销。`pack` / `packs` 声明为 volatile，插件只读取配置，不写回任何用户设置。

## 安装

```powershell
dsh plugin --profile desktop add dsh-locale-pack-loader
```

## 许可

MIT
