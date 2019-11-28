import * as vscode from 'vscode';

function notify(message: string) {
    vscode.window.showInformationMessage(message);
}

// configuration
const config = vscode.workspace.getConfiguration('styleSeparators');
const lineWidth = config.get<number>('lineWidth') || 120;
const lineCharacter = config.get<string>('lineCharacter') || '-';
const variantPrefix = config.get<string>('variantPrefix') || '&--';
const variantTitle = config.get<string>('variantTitle') || 'variant {variant}';
const statePrefix = config.get<string>('statePrefix') || '&.';
const stateTitle = config.get<string>('stateTitle') || 'state {state}';

const classNameRegex = /\s*\.([a-zA-Z0-9-_]+)/;
const variantRegex = new RegExp(`\s*${variantPrefix}([a-zA-Z0-9-_]+)`);
const stateRegex = /\s*&\.([a-zA-Z0-9-_]+)/;
const otherBlockRegex = /^\s*?([^\s]+)[^{]*?{\s*?$/;

/**
 * Create separator for style block
 *
 * @param title Separator title
 * @param indent Indentation to use
 * @param withTopSpace Whether to add new line before separator
 */
export function createSeparator(title: string = '', indent: number = 0, withTopSpace: boolean = false) {
    const indentation = ' '.repeat(indent);
    const line = lineCharacter.repeat(lineWidth - indent - 3);
    const topSpace = withTopSpace ? `\n${indentation}` : '';
    return `${topSpace}// ${title}\n${indentation}// ${line}\n${indentation}`;
}

export function getIndentation(lineText: string) {
    return lineText.search(/[^\s]/);
}

/**
 * Get separator for lne of text if needed
 *
 * @param lineText Current line text
 * @param previousLineText Previous line text or null if is first line
 */
export function getLineSeparator(lineText: string, previousLineText: string | null = null) {
    if (previousLineText && previousLineText.includes(`// ${lineCharacter}`)) { // already has separator
        return '';
    }

    const hasTopSpace = previousLineText === null || '' === previousLineText.trim();

    const classNameMatches = lineText.match(classNameRegex);
    if (classNameMatches) {
        const className = classNameMatches[1];
        const indentationLength = lineText.indexOf(`.${className}`);

        return createSeparator(className, indentationLength, !hasTopSpace);
    }

    const variantMatches = lineText.match(variantRegex);
    if (variantMatches) {
        const variantName = variantMatches[1];
        const indentationLength = lineText.indexOf(`${variantPrefix}${variantName}`);

        return createSeparator(variantTitle.replace('{variant}', variantName), indentationLength, !hasTopSpace);
    }

    const stateMatches = lineText.match(stateRegex);
    if (stateMatches) {
        const stateName = stateMatches[1];
        const indentationLength = lineText.indexOf(`${statePrefix}${stateName}`);

        return createSeparator(stateTitle.replace('{state}', stateName), indentationLength, !hasTopSpace);
    }

    const otherBlockMatches = lineText.match(otherBlockRegex);
    if (otherBlockMatches) {
        const otherBlockStart = otherBlockMatches[1];
        const indentationLength = lineText.indexOf(otherBlockStart);

        return createSeparator('', indentationLength, !hasTopSpace);
    }

    return '';
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.styleSeparators', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            notify('No active editor available');
            return;
        }

        const insertions: Map<vscode.Position, string> = new Map();
        for (let lineNumber = 0; lineNumber < editor.document.lineCount; lineNumber++) {
            const lineText = editor.document.lineAt(lineNumber).text;
            const previousLineText = lineNumber > 0 ? editor.document.lineAt(lineNumber - 1).text : null;

            const lineSeparator = getLineSeparator(lineText, previousLineText);

            if (lineSeparator) {
                const indentationLength = getIndentation(lineText);
                insertions.set(
                    new vscode.Position(lineNumber, indentationLength),
                    lineSeparator,
                );
            }
        }

        if (insertions.size) {
            editor.edit((edit) => {
                insertions.forEach((separator, position) => {
                    edit.insert(position, separator);
                });
            });
        } else {
            notify('All good! No separators needed here.');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
