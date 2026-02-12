const vscode = require('vscode');
const { exec } = require('child_process');

// ── Wrench library definitions ──────────────────────────────────────────────

const WRENCH_LIBRARIES = {
    math: {
        description: 'Mathematical functions',
        functions: {
            sin:     { signature: 'math::sin(x)', doc: 'Sine of x (radians)' },
            cos:     { signature: 'math::cos(x)', doc: 'Cosine of x (radians)' },
            tan:     { signature: 'math::tan(x)', doc: 'Tangent of x (radians)' },
            sinh:    { signature: 'math::sinh(x)', doc: 'Hyperbolic sine of x' },
            cosh:    { signature: 'math::cosh(x)', doc: 'Hyperbolic cosine of x' },
            tanh:    { signature: 'math::tanh(x)', doc: 'Hyperbolic tangent of x' },
            asin:    { signature: 'math::asin(x)', doc: 'Arc sine of x' },
            acos:    { signature: 'math::acos(x)', doc: 'Arc cosine of x' },
            atan:    { signature: 'math::atan(x)', doc: 'Arc tangent of x' },
            atan2:   { signature: 'math::atan2(y, x)', doc: 'Arc tangent of y/x using signs to determine quadrant' },
            log:     { signature: 'math::log(x)', doc: 'Natural logarithm of x' },
            ln:      { signature: 'math::ln(x)', doc: 'Natural logarithm of x (alias)' },
            log10:   { signature: 'math::log10(x)', doc: 'Base-10 logarithm of x' },
            exp:     { signature: 'math::exp(x)', doc: 'e raised to the power x' },
            pow:     { signature: 'math::pow(base, exp)', doc: 'base raised to the power exp' },
            sqrt:    { signature: 'math::sqrt(x)', doc: 'Square root of x' },
            ceil:    { signature: 'math::ceil(x)', doc: 'Smallest integer >= x' },
            floor:   { signature: 'math::floor(x)', doc: 'Largest integer <= x' },
            trunc:   { signature: 'math::trunc(x)', doc: 'Truncate x toward zero' },
            abs:     { signature: 'math::abs(x)', doc: 'Absolute value of x' },
            fmod:    { signature: 'math::fmod(x, y)', doc: 'Floating-point remainder of x/y' },
            ldexp:   { signature: 'math::ldexp(x, exp)', doc: 'x * 2^exp' },
            deg2rad: { signature: 'math::deg2rad(deg)', doc: 'Convert degrees to radians' },
            rad2deg: { signature: 'math::rad2deg(rad)', doc: 'Convert radians to degrees' },
            iscale:  { signature: 'math::iscale(val, from, to)', doc: 'Integer scale value from one range to another' },
        }
    },
    str: {
        description: 'String manipulation functions',
        functions: {
            strlen:    { signature: 'str::strlen(s)', doc: 'Get string length' },
            sprintf:   { signature: 'str::sprintf(fmt, ...)', doc: 'Formatted string output' },
            format:    { signature: 'str::format(fmt, ...)', doc: 'Format a string' },
            printf:    { signature: 'str::printf(fmt, ...)', doc: 'Print formatted string' },
            chr:       { signature: 'str::chr(s, c)', doc: 'Find character c in string s' },
            tolower:   { signature: 'str::tolower(s)', doc: 'Convert string to lowercase' },
            toupper:   { signature: 'str::toupper(s)', doc: 'Convert string to uppercase' },
            tol:       { signature: 'str::tol(s)', doc: 'Convert string to integer (long)' },
            concat:    { signature: 'str::concat(a, b)', doc: 'Concatenate two strings' },
            left:      { signature: 'str::left(s, n)', doc: 'Get leftmost n characters' },
            right:     { signature: 'str::right(s, n)', doc: 'Get rightmost n characters' },
            mid:       { signature: 'str::mid(s, start, len)', doc: 'Get substring from middle' },
            substr:    { signature: 'str::substr(s, start, len)', doc: 'Get substring' },
            trim:      { signature: 'str::trim(s)', doc: 'Trim whitespace from both ends' },
            trimleft:  { signature: 'str::trimleft(s)', doc: 'Trim whitespace from left' },
            trimright: { signature: 'str::trimright(s)', doc: 'Trim whitespace from right' },
            insert:    { signature: 'str::insert(s, pos, ins)', doc: 'Insert string at position' },
            tprint:    { signature: 'str::tprint(val)', doc: 'Type-aware print' },
            isspace:   { signature: 'str::isspace(c)', doc: 'Test if character is whitespace' },
            isdigit:   { signature: 'str::isdigit(c)', doc: 'Test if character is a digit' },
            isalpha:   { signature: 'str::isalpha(c)', doc: 'Test if character is alphabetic' },
        }
    },
    io: {
        description: 'File and hardware I/O functions',
        functions: {
            readFile:   { signature: 'io::readFile(path)', doc: 'Read entire file contents' },
            writeFile:  { signature: 'io::writeFile(path, data)', doc: 'Write data to file' },
            deleteFile: { signature: 'io::deleteFile(path)', doc: 'Delete a file' },
            getline:    { signature: 'io::getline()', doc: 'Read a line from input' },
            open:       { signature: 'io::open(path, flags)', doc: 'Open a file handle' },
            close:      { signature: 'io::close(fd)', doc: 'Close a file handle' },
            read:       { signature: 'io::read(fd, count)', doc: 'Read from file handle' },
            write:      { signature: 'io::write(fd, data)', doc: 'Write to file handle' },
            seek:       { signature: 'io::seek(fd, offset, whence)', doc: 'Seek in file handle' },
            fsync:      { signature: 'io::fsync(fd)', doc: 'Flush file to disk' },
        }
    },
    std: {
        description: 'Standard library functions',
        functions: {
            rand:        { signature: 'std::rand()', doc: 'Generate random number' },
            srand:       { signature: 'std::srand(seed)', doc: 'Seed the random number generator' },
            delay:       { signature: 'std::delay(ms)', doc: 'Delay execution for ms milliseconds' },
            time:        { signature: 'std::time()', doc: 'Get current time' },
            serialize:   { signature: 'std::serialize(val)', doc: 'Serialize value to binary' },
            deserialize: { signature: 'std::deserialize(data)', doc: 'Deserialize binary to value' },
        }
    },
    sys: {
        description: 'System functions',
        functions: {
            isFunction:    { signature: 'sys::isFunction(name)', doc: 'Check if name is a callable function' },
            importByteCode:{ signature: 'sys::importByteCode(data)', doc: 'Import compiled bytecode' },
            importCompile: { signature: 'sys::importCompile(source)', doc: 'Compile and import source code' },
            halt:          { signature: 'sys::halt(code)', doc: 'Halt execution with error code' },
        }
    },
    msg: {
        description: 'Inter-context messaging',
        functions: {
            read:  { signature: 'msg::read()', doc: 'Read a message' },
            write: { signature: 'msg::write(data)', doc: 'Write a message' },
            clear: { signature: 'msg::clear()', doc: 'Clear message queue' },
            peek:  { signature: 'msg::peek()', doc: 'Peek at next message without consuming' },
        }
    },
    debug: {
        description: 'Debug output functions',
        functions: {
            print:   { signature: 'debug::print(val)', doc: 'Debug print value' },
            println: { signature: 'debug::println(val)', doc: 'Debug print value with newline' },
        }
    },
    array: {
        description: 'Array container operations',
        functions: {
            clear:    { signature: 'array::clear(arr)', doc: 'Clear all elements' },
            count:    { signature: 'array::count(arr)', doc: 'Get number of elements' },
            remove:   { signature: 'array::remove(arr, index)', doc: 'Remove element at index' },
            insert:   { signature: 'array::insert(arr, index, val)', doc: 'Insert element at index' },
            truncate: { signature: 'array::truncate(arr, size)', doc: 'Truncate array to size' },
        }
    },
    hash: {
        description: 'Hash table operations',
        functions: {
            clear:  { signature: 'hash::clear(h)', doc: 'Clear all entries' },
            count:  { signature: 'hash::count(h)', doc: 'Get number of entries' },
            add:    { signature: 'hash::add(h, key, val)', doc: 'Add key-value pair' },
            remove: { signature: 'hash::remove(h, key)', doc: 'Remove entry by key' },
            exists: { signature: 'hash::exists(h, key)', doc: 'Check if key exists' },
        }
    },
    list: {
        description: 'Linked list operations',
        functions: {
            clear:     { signature: 'list::clear(l)', doc: 'Clear all elements' },
            count:     { signature: 'list::count(l)', doc: 'Get number of elements' },
            peek:      { signature: 'list::peek(l)', doc: 'Peek at front element' },
            pop:       { signature: 'list::pop(l)', doc: 'Remove and return front element' },
            pop_front: { signature: 'list::pop_front(l)', doc: 'Remove and return front element' },
            pop_back:  { signature: 'list::pop_back(l)', doc: 'Remove and return back element' },
            push:      { signature: 'list::push(l, val)', doc: 'Push to back' },
            push_front:{ signature: 'list::push_front(l, val)', doc: 'Push to front' },
            push_back: { signature: 'list::push_back(l, val)', doc: 'Push to back' },
        }
    },
    queue: {
        description: 'Queue (FIFO) operations',
        functions: {
            clear: { signature: 'queue::clear(q)', doc: 'Clear all elements' },
            count: { signature: 'queue::count(q)', doc: 'Get number of elements' },
            push:  { signature: 'queue::push(q, val)', doc: 'Push element to back' },
            pop:   { signature: 'queue::pop(q)', doc: 'Pop element from front' },
            peek:  { signature: 'queue::peek(q)', doc: 'Peek at front element' },
        }
    },
    stack: {
        description: 'Stack (LIFO) operations',
        functions: {
            clear: { signature: 'stack::clear(s)', doc: 'Clear all elements' },
            count: { signature: 'stack::count(s)', doc: 'Get number of elements' },
            push:  { signature: 'stack::push(s, val)', doc: 'Push element to top' },
            pop:   { signature: 'stack::pop(s)', doc: 'Pop element from top' },
            peek:  { signature: 'stack::peek(s)', doc: 'Peek at top element' },
        }
    },
};

const WRENCH_KEYWORDS = [
    'if', 'else', 'while', 'do', 'for', 'switch', 'case', 'default',
    'break', 'continue', 'return', 'yield', 'goto',
    'var', 'function', 'struct', 'new', 'export', 'enum', 'unit',
    'true', 'false', 'null',
    'int', 'float',
];

// ── Completion Provider ─────────────────────────────────────────────────────

function createCompletionProvider() {
    return vscode.languages.registerCompletionItemProvider('wrench', {
        provideCompletionItems(document, position) {
            const lineText = document.lineAt(position).text;
            const textBeforeCursor = lineText.substring(0, position.character);

            // Check if we're after a namespace:: prefix
            const nsMatch = textBeforeCursor.match(/\b(\w+)::(\w*)$/);
            if (nsMatch) {
                const ns = nsMatch[1];
                const lib = WRENCH_LIBRARIES[ns];
                if (lib) {
                    return Object.entries(lib.functions).map(([name, info]) => {
                        const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Function);
                        item.detail = info.signature;
                        item.documentation = new vscode.MarkdownString(`${info.doc}\n\n*${lib.description}*`);
                        item.sortText = `0_${name}`;
                        return item;
                    });
                }
                return [];
            }

            const items = [];

            // Namespace completions (when not already in one)
            for (const [ns, lib] of Object.entries(WRENCH_LIBRARIES)) {
                const item = new vscode.CompletionItem(ns, vscode.CompletionItemKind.Module);
                item.detail = lib.description;
                item.insertText = new vscode.SnippetString(`${ns}::\${1}`);
                item.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger' };
                item.sortText = `1_${ns}`;
                items.push(item);
            }

            // Keyword completions
            for (const kw of WRENCH_KEYWORDS) {
                const item = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword);
                item.sortText = `2_${kw}`;
                items.push(item);
            }

            return items;
        }
    }, ':');
}

// ── Diagnostics ─────────────────────────────────────────────────────────────

let diagnosticCollection;
let compilerNotFoundWarned = false;
let resolvedShellEnv = null;

/**
 * Resolve the user's login shell PATH once at startup.
 * exec() uses /bin/sh which doesn't source .zshrc/.bashrc, so tools added to
 * PATH in those files (like wrench) won't be found. We spawn the user's shell
 * as an interactive login shell to get the real PATH.
 */
function resolveShellEnv() {
    return new Promise((resolve) => {
        const userShell = process.env.SHELL || '/bin/sh';
        // Use -ilc to get an interactive login shell that sources profile/rc files
        exec(`${userShell} -ilc 'echo __ENV_START__ && env'`, { timeout: 5000 }, (err, stdout) => {
            if (err || !stdout) {
                resolve(process.env);
                return;
            }
            // Parse the env output after our marker
            const envStr = stdout.split('__ENV_START__\n').pop() || '';
            const env = { ...process.env };
            for (const line of envStr.split('\n')) {
                const idx = line.indexOf('=');
                if (idx > 0) {
                    env[line.substring(0, idx)] = line.substring(idx + 1);
                }
            }
            resolve(env);
        });
    });
}

function getCompilerPath() {
    return vscode.workspace.getConfiguration('wrench').get('compilerPath', 'wrench');
}

function runDiagnostics(document) {
    if (document.languageId !== 'wrench') {
        return;
    }

    if (!resolvedShellEnv) {
        return;
    }

    const compilerPath = getCompilerPath();
    const filePath = document.uri.fsPath;

    // Use /dev/null (or NUL on Windows) as output since we only want to check for errors
    const nullDev = process.platform === 'win32' ? 'NUL' : '/dev/null';

    const escapedPath = filePath.replace(/'/g, "'\\''");
    const cmd = `'${compilerPath.replace(/'/g, "'\\''")}' c '${escapedPath}' ${nullDev}`;

    exec(cmd, { timeout: 10000, env: resolvedShellEnv }, (error, stdout, stderr) => {
        diagnosticCollection.delete(document.uri);

        // Exit code 127 means "command not found"
        if (error && error.code === 127) {
            if (!compilerNotFoundWarned) {
                compilerNotFoundWarned = true;
                vscode.window.showWarningMessage(
                    `Wrench compiler not found at "${compilerPath}". Set wrench.compilerPath in settings to enable diagnostics.`
                );
            }
            return;
        }

        // Wrench prints errors to stdout
        const output = (stdout || '');
        if (!output.trim()) {
            return;
        }

        const diagnostics = parseCompilerOutput(output, document);
        if (diagnostics.length > 0) {
            diagnosticCollection.set(document.uri, diagnostics);
        }
    });
}

function parseCompilerOutput(output, document) {
    const diagnostics = [];

    // Match the wrench error format:
    // line:<number>
    // err: <message>[<code>]
    // <number>     <source_line>
    //              ^
    // The source line is formatted as "%-5d %s" — 5-char wide line number + 1 space = 6 char prefix
    const errorPattern = /line:(\d+)\s*\nerr:\s*(.+?\[\d+\])\s*\n.*\n(\s*)\^/g;
    let match;

    while ((match = errorPattern.exec(output)) !== null) {
        const lineNum = parseInt(match[1], 10) - 1; // Convert to 0-indexed
        const message = match[2].trim();
        const caretSpaces = match[3];
        // Subtract the 6-char prefix (%-5d + space) to get the actual source column
        const column = Math.max(0, caretSpaces.length - 6);

        const line = Math.max(0, Math.min(lineNum, document.lineCount - 1));
        const lineLength = document.lineAt(line).text.length;

        const range = new vscode.Range(
            new vscode.Position(line, Math.min(column, lineLength)),
            new vscode.Position(line, lineLength)
        );

        const diagnostic = new vscode.Diagnostic(
            range,
            message,
            vscode.DiagnosticSeverity.Error
        );
        diagnostic.source = 'wrench';
        diagnostics.push(diagnostic);
    }

    // Fallback: if we got output but no structured match, try a simpler parse
    if (diagnostics.length === 0 && output.includes('err:')) {
        const simpleMatch = output.match(/line:(\d+)\s*\nerr:\s*(.+)/);
        if (simpleMatch) {
            const lineNum = Math.max(0, parseInt(simpleMatch[1], 10) - 1);
            const message = simpleMatch[2].trim();
            const line = Math.min(lineNum, document.lineCount - 1);

            const range = new vscode.Range(
                new vscode.Position(line, 0),
                new vscode.Position(line, document.lineAt(line).text.length)
            );

            const diagnostic = new vscode.Diagnostic(
                range,
                message,
                vscode.DiagnosticSeverity.Error
            );
            diagnostic.source = 'wrench';
            diagnostics.push(diagnostic);
        }
    }

    // Handle link errors
    if (diagnostics.length === 0 && output.includes('link error')) {
        const linkMatch = output.match(/link error\s*\[(\d+)\]/);
        if (linkMatch) {
            const range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));
            const diagnostic = new vscode.Diagnostic(
                range,
                `Link error [${linkMatch[1]}]`,
                vscode.DiagnosticSeverity.Error
            );
            diagnostic.source = 'wrench';
            diagnostics.push(diagnostic);
        }
    }

    return diagnostics;
}

// ── Run File ────────────────────────────────────────────────────────────────

let wrenchTerminal = null;

function getOrCreateTerminal() {
    // Reuse existing terminal if it's still alive
    if (wrenchTerminal && !wrenchTerminal.exitStatus) {
        return wrenchTerminal;
    }
    wrenchTerminal = vscode.window.createTerminal({ name: 'Wrench' });
    return wrenchTerminal;
}

async function runWrenchFile() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active file to run.');
        return;
    }

    const document = editor.document;
    if (document.languageId !== 'wrench') {
        vscode.window.showErrorMessage('Active file is not a Wrench file.');
        return;
    }

    // Save before running
    if (document.isDirty) {
        await document.save();
    }

    const compilerPath = getCompilerPath();
    const filePath = document.uri.fsPath;
    const escapedPath = filePath.replace(/'/g, "'\\''");

    const terminal = getOrCreateTerminal();
    terminal.show();
    terminal.sendText(`${compilerPath} r '${escapedPath}'`);
}

// ── Activation ──────────────────────────────────────────────────────────────

async function activate(context) {
    // Completion provider
    context.subscriptions.push(createCompletionProvider());

    // Run file command
    context.subscriptions.push(
        vscode.commands.registerCommand('wrench.runFile', runWrenchFile)
    );

    // Clean up terminal reference when it closes
    context.subscriptions.push(
        vscode.window.onDidCloseTerminal((terminal) => {
            if (terminal === wrenchTerminal) {
                wrenchTerminal = null;
            }
        })
    );

    // Diagnostics
    diagnosticCollection = vscode.languages.createDiagnosticCollection('wrench');
    context.subscriptions.push(diagnosticCollection);

    // Resolve the user's shell environment (PATH etc.) before running diagnostics
    resolvedShellEnv = await resolveShellEnv();

    // Run diagnostics on save
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument((document) => {
            runDiagnostics(document);
        })
    );

    // Run diagnostics on open
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument((document) => {
            runDiagnostics(document);
        })
    );

    // Clear diagnostics when file is closed
    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument((document) => {
            diagnosticCollection.delete(document.uri);
        })
    );

    // Run diagnostics for any already-open wrench files
    vscode.workspace.textDocuments.forEach((document) => {
        runDiagnostics(document);
    });
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
