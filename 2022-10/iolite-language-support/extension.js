// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "iolite-language-support" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('iolite.helloWorlds', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Iolite Language Support!');
	});

	context.subscriptions.push(disposable);

	var keywords = [
		"if", "else", "while", "for",
		"break", "continue", "return",
		"switch", "case", "default",
		"asm", "goto",
		
		// types
		"int", "float", "double", "char", "string", "bool",
		"void", "null", "short", "long", "unsigned", "signed",
		"const", "static", "volatile", "register", "auto",
		"enum", "struct", "union", "typedef",
		"sizeof", "typeof", "alignof", "alignas",
		"inline", "restrict",
	];

	var keyword_completion_items = [];
	for (var i = 0; i < keywords.length; i++) {
		var completion_item = new vscode.CompletionItem(keywords[i]);
		completion_item.kind = vscode.CompletionItemKind.Keyword;
		completion_item.detail = "Iolite keyword";
		keyword_completion_items.push(completion_item);
	}


	function provideCompletion() {
		var editorContent = vscode.window.activeTextEditor.document.getText();
		var beforeCursor = editorContent.substring(0, vscode.window.activeTextEditor.document.offsetAt(vscode.window.activeTextEditor.selection.active));
		var brackets = editorContent.split("{");

		var curWord = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.document.getWordRangeAtPosition(vscode.window.activeTextEditor.selection.active));
		// remove current word from beforeCursor so we don't get it in the suggestions
		beforeCursor = beforeCursor.substring(0, beforeCursor.length - curWord.length);
		

		var completionItems = [
			new vscode.CompletionItem("argc", vscode.CompletionItemKind.Variable),
			new vscode.CompletionItem("argv", vscode.CompletionItemKind.Variable)
		];

		completionItems = completionItems.concat(keyword_completion_items);

		// Find variable names
		// Look for:
		// (int|float|double|char|bool|void|string|byte) <variable name>
		var variableRegex = /((int|float|double|char|bool|void|string|byte)\s+([a-zA-Z0-9_]+))/g;
		var variableMatch = variableRegex.exec(beforeCursor);

		while (variableMatch != null) {
			var variableName = variableMatch[3];
			var variableType = variableMatch[2];
			var completionItem = new vscode.CompletionItem(variableName, vscode.CompletionItemKind.Variable);
			completionItem.detail = variableType;
			completionItems.push(completionItem);
			variableMatch = variableRegex.exec(editorContent);
		}

		return completionItems;
	}

	// Add the completion items, but make sure it updates and doesn't just add
	// once when we open the file
	var completionProvider = vscode.languages.registerCompletionItemProvider('iolite', {
		provideCompletionItems: provideCompletion
	}, [
		' ',
		'.',
		'(',
		')',
		'{',
		'}',
		';',
		',',
		'[',
		']',
		'!',
		'\n',
		'\t'
	]);

	context.subscriptions.push(completionProvider);


	// Provide hover information
	function provideHover(document, position, token) {
		// Send the current line
		var line = document.lineAt(position.line).text;
		var wordRange = document.getWordRangeAtPosition(position);
		var word = document.getText(wordRange);

		switch (word) {
			case "entry":
				return new vscode.Hover("The entry point of the program");

			case "return":
				return new vscode.Hover("Returns a value from a function");

			case "if":
				return new vscode.Hover("If statement");

			case "else":
				return new vscode.Hover("Else statement");

			case "elif":
				return new vscode.Hover("Else if statement");

			case "while":
				return new vscode.Hover("Do something while a condition is true");

			case "for":
				return new vscode.Hover("Repeat something a certain number of times");

			case "break":
				return new vscode.Hover("Break out of a loop");

			case "continue":
				return new vscode.Hover("Continue to the next iteration of a loop");

			case "switch":
				return new vscode.Hover("Switch a variable between different values");

			case "case":
				return new vscode.Hover("A case in a switch statement");

			case "default":
				return new vscode.Hover("Fallback case in a switch statement");

			case "func":
				return new vscode.Hover("Define a function");

			case "->":
				return new vscode.Hover("Type definition");

			case "cimport":
				return new vscode.Hover("Import a C library");

			case "import":
				return new vscode.Hover("Import a Iolite library");
		}
	}

	// Add the completion items, but make sure it updates and doesn't just add
	// once when we open the file
	var hoverProvider = vscode.languages.registerHoverProvider('iolite', {
		provideHover: provideHover
	});

	context.subscriptions.push(hoverProvider);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
