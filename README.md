# Wrench Language Support for VSCode

A Visual Studio Code extension that provides syntax highlighting and language
support for the Wrench interpreted language.

## Features

- **Syntax Highlighting**: Full syntax highlighting for Wrench keywords,
  operators, strings, numbers, and comments
- **Language Configuration**: Auto-closing brackets, comment toggling, and
  proper indentation
- **File Association**: Supports `.wr` and `.wrench` file extensions

## Supported Language Features

### Keywords

- Control flow: `if`, `else`, `while`, `do`, `for`, `switch`, `case`, `default`,
  `break`, `continue`, `return`, `yield`
- Declarations: `var`, `function`, `struct`, `new`, `export`, `enum`
- Constants: `true`, `false`, `null`, `undefined`

### Data Types

- 32-bit integers and floats
- Strings (single and double quoted)
- Arrays and hash tables
- Structs and enums

### Comments

- Single-line comments: `//`
- Multi-line comments: `/* */`

### Operators

- Arithmetic: `+`, `-`, `*`, `/`, `%`, `++`, `--`
- Comparison: `==`, `!=`, `>=`, `<=`, `>`, `<`
- Logical: `||`, `&&`, `!`
- Bitwise: `|`, `&`, `^`, `>>`, `<<`, `~`
- Assignment: `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `|=`, `&=`, `^=`, `>>=`, `<<=`
- Global scope: `::`

## Installation

### From Source

1. Clone or download this repository
2. Install the VSCode Extension Manager: `npm install -g vsce`
3. Package the extension: `vsce package`
4. Install the generated `.vsix` file in VSCode using
   `code --install-extension wrench-language-support-1.0.0.vsix` (replacing the
   version number with the appropriate one from the build)

### Manual Installation

1. Copy this folder to your VSCode extensions directory:
   - **Windows**: `%USERPROFILE%\.vscode\extensions`
   - **macOS**: `~/.vscode/extensions`
   - **Linux**: `~/.vscode/extensions`
2. Restart VSCode

## About Wrench

Wrench is a compact, embedded scripting language designed for microcontrollers
and embedded systems. It features:

- C-like syntax with weak typing
- Small footprint (~32k ROM, ~1k RAM)
- Native support for 32-bit integers, floats, and strings
- Cooperative multi-threading and yielding
- Easy integration with native code

For more information, visit:

- [Wrench Documentation](https://home.workshopfriends.com/wrench/www/)
- [Source Code](https://github.com/jingoro2112/wrench)

## Contributing

This extension is based on the Wrench language specification. If you find any
issues or want to contribute improvements, please feel free to submit issues or
pull requests.

## License

This extension is provided as-is for the Wrench programming language community.
