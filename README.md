# Wrench Language Support for VSCode

A Visual Studio Code extension that provides syntax highlighting, code
completions, compiler diagnostics, and run support for the
[Wrench](https://github.com/jingoro2112/wrench) embedded scripting language.

## Features

- **Syntax Highlighting** — keywords, operators, strings, numbers, comments,
  and namespaced library calls (`math::sin`, `str::strlen`, etc.)
- **Code Snippets** — common patterns like `fn`, `for`, `while`, `if`, `struct`,
  `enum`, `switch`, and more
- **Auto-Completions** — context-aware completions for all 14 standard library
  namespaces (`math::`, `str::`, `io::`, `std::`, `sys::`, `msg::`, `debug::`,
  `array::`, `hash::`, `list::`, `queue::`, `stack::`) with documentation
- **Compiler Diagnostics** — errors shown as red squiggles on save, powered by
  the wrench compiler
- **Run File** — compile and execute `.wr` files directly from the editor
- **Language Configuration** — auto-closing brackets, comment toggling, code
  folding, and proper indentation
- **File Association** — `.wr` and `.wrench` file extensions

## Running Wrench Files

There are three ways to run the current file:

- **Ctrl+F5** keyboard shortcut (when editing a `.wr` file)
- **Play button** in the editor title bar
- **Command Palette** — "Wrench: Run File"

Output appears in a dedicated "Wrench" terminal. The file is saved automatically
before each run.

## Compiler Diagnostics

When you save a `.wr` file, the extension runs the wrench compiler and shows any
errors inline. This requires the `wrench` CLI to be available.

Configure the compiler path in settings if it's not on your PATH:

```json
{
  "wrench.compilerPath": "/path/to/wrench"
}
```

## Snippets

| Prefix           | Description            |
|------------------|------------------------|
| `fn`/`function`  | Function declaration   |
| `main`           | Main function scaffold |
| `for`            | For loop with counter  |
| `while`          | While loop             |
| `do`             | Do-while loop          |
| `if`             | If statement           |
| `ife`            | If-else statement      |
| `switch`         | Switch-case-default    |
| `struct`         | Struct declaration     |
| `enum`           | Enum declaration       |
| `var`            | Variable declaration   |
| `print`          | Print                  |
| `println`        | Print with newline     |

## Supported Language Features

### Keywords

- Control flow: `if`, `else`, `while`, `do`, `for`, `switch`, `case`, `default`,
  `break`, `continue`, `return`, `yield`, `goto`
- Declarations: `var`, `function`, `struct`, `new`, `export`, `enum`, `unit`
- Types: `int`, `float`
- Constants: `true`, `false`, `null`

### Data Types

- 32-bit integers and floats
- Strings (double-quoted with escape sequences)
- Arrays and hash tables
- Structs and enums (anonymous: `enum { RED, GREEN, BLUE }`)

### Comments

- Single-line: `//`
- Multi-line: `/* */`
- Folding regions: `//#region` / `//#endregion`

### Operators

- Arithmetic: `+`, `-`, `*`, `/`, `%`, `++`, `--`
- Comparison: `==`, `!=`, `>=`, `<=`, `>`, `<`
- Logical: `||`, `&&`, `!`
- Bitwise: `|`, `&`, `^`, `>>`, `<<`, `~`
- Assignment: `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `|=`, `&=`, `^=`, `>>=`, `<<=`
- Namespace: `::`

## Settings

| Setting               | Default    | Description                            |
|-----------------------|------------|----------------------------------------|
| `wrench.compilerPath` | `"wrench"` | Path to the wrench compiler executable |

## Installation

### From GitHub Releases

Download the latest `.vsix` from the
[Releases](../../releases) page and install it:

```sh
code --install-extension wrench-language-support-X.Y.Z.vsix
```

### From Source

1. Clone this repository
2. Install the VSCode Extension Manager: `npm install -g @vscode/vsce`
3. Package the extension: `vsce package --no-dependencies`
4. Install the generated `.vsix` file:
   `code --install-extension wrench-language-support-*.vsix`

### Manual Installation

Copy this folder to your VSCode extensions directory:

- **Windows**: `%USERPROFILE%\.vscode\extensions`
- **macOS**: `~/.vscode/extensions`
- **Linux**: `~/.vscode/extensions`

## About Wrench

Wrench is a compact, embedded scripting language designed for microcontrollers
and embedded systems. It features:

- C-like syntax with weak typing
- Small footprint (~32k ROM, ~1k RAM)
- Native support for 32-bit integers, floats, and strings
- Cooperative multi-threading and yielding
- Easy integration with native code

For more information:

- [Wrench Documentation](https://home.workshopfriends.com/wrench/www/)
- [Source Code](https://github.com/jingoro2112/wrench)

## Contributing

If you find any issues or want to contribute improvements, please submit issues
or pull requests.

## License

MIT
