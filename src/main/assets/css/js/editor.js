// Configuração e controle do editor
class CodeEditor {
    constructor() {
        this.editor = null;
        this.currentLanguage = 'javascript';
        this.isInitialized = false;
        this.consoleOutput = [];
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            // Configura o Monaco Editor
            require.config({ 
                paths: { 
                    'vs': 'file:///android_asset/vs',
                    'css': 'file:///android_asset/css'
                }
            });

            await new Promise((resolve, reject) => {
                require(['vs/editor/editor.main'], resolve, reject);
            });

            this.createEditor();
            this.setupLanguageSupport();
            this.isInitialized = true;
            
            console.log('Editor inicializado com sucesso');
        } catch (error) {
            console.error('Erro ao inicializar editor:', error);
        }
    }

    createEditor() {
        this.editor = monaco.editor.create(document.getElementById('editor'), {
            value: this.getDefaultCode('javascript'),
            language: 'javascript',
            theme: 'vs-dark',
            fontSize: 14,
            fontFamily: "'Cascadia Code', 'Fira Code', Consolas, monospace",
            minimap: { enabled: true },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: true,
            lightbulb: { enabled: true },
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
            bracketPairColorization: { enabled: true },
            renderLineHighlight: 'all',
            scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false
            }
        });

        // Event listeners
        this.editor.onDidChangeModelContent(this.onContentChange.bind(this));
        this.editor.onDidChangeModelDecorations(this.onDecorationsChange.bind(this));
    }

    setupLanguageSupport() {
        // Configura suporte para múltiplas linguagens
        this.setupJavaScriptSupport();
        this.setupPythonSupport();
        this.setupHTMLSupport();
        this.setupCSSSupport();
        this.setupJavaSupport();
    }

    setupJavaScriptSupport() {
        monaco.languages.registerCompletionItemProvider('javascript', {
            provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                const suggestions = this.getJavaScriptSuggestions(range);
                return { suggestions };
            }
        });
    }

    getJavaScriptSuggestions(range) {
        return [
            // Funções comuns
            {
                label: 'console.log',
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: 'Exibe mensagem no console',
                insertText: 'console.log(${1:value});',
                range: range
            },
            {
                label: 'alert',
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: 'Exibe caixa de alerta',
                insertText: 'alert(${1:message});',
                range: range
            },
            
            // Declarações
            {
                label: 'function',
                kind: monaco.languages.CompletionItemKind.Keyword,
                documentation: 'Declara uma função',
                insertText: 'function ${1:functionName}(${2:parameters}) {\n\t${3:// code}\n}',
                range: range
            },
            {
                label: 'const',
                kind: monaco.languages.CompletionItemKind.Keyword,
                documentation: 'Declara uma constante',
                insertText: 'const ${1:name} = ${2:value};',
                range: range
            },
            {
                label: 'let',
                kind: monaco.languages.CompletionItemKind.Keyword,
                documentation: 'Declara uma variável',
                insertText: 'let ${1:name} = ${2:value};',
                range: range
            },
            
            // Estruturas de controle
            {
                label: 'if',
                kind: monaco.languages.CompletionItemKind.Snippet,
                documentation: 'Declaração condicional if',
                insertText: 'if (${1:condition}) {\n\t${2:// code}\n}',
                range: range
            },
            {
                label: 'for',
                kind: monaco.languages.CompletionItemKind.Snippet,
                documentation: 'Loop for',
                insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3:// code}\n}',
                range: range
            },
            {
                label: 'while',
                kind: monaco.languages.CompletionItemKind.Snippet,
                documentation: 'Loop while',
                insertText: 'while (${1:condition}) {\n\t${2:// code}\n}',
                range: range
            },
            
            // Métodos de array
            {
                label: 'forEach',
                kind: monaco.languages.CompletionItemKind.Method,
                documentation: 'Itera sobre um array',
                insertText: 'forEach((${1:item}) => {\n\t${2:// code}\n});',
                range: range
            },
            {
                label: 'map',
                kind: monaco.languages.CompletionItemKind.Method,
                documentation: 'Transforma elementos do array',
                insertText: 'map((${1:item}) => ${2:expression});',
                range: range
            }
        ];
    }

    setupPythonSupport() {
        monaco.languages.registerCompletionItemProvider('python', {
            provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                return { 
                    suggestions: this.getPythonSuggestions(range) 
                };
            }
        });
    }

    getPythonSuggestions(range) {
        return [
            {
                label: 'print',
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: 'Exibe mensagem no console',
                insertText: 'print(${1:value})',
                range: range
            },
            {
                label: 'def',
                kind: monaco.languages.CompletionItemKind.Keyword,
                documentation: 'Define uma função',
                insertText: 'def ${1:function_name}(${2:parameters}):\n\t${3:pass}',
                range: range
            },
            {
                label: 'if',
                kind: monaco.languages.CompletionItemKind.Keyword,
                documentation: 'Declaração condicional',
                insertText: 'if ${1:condition}:\n\t${2:pass}',
                range: range
            },
            {
                label: 'for',
                kind: monaco.languages.CompletionItemKind.Keyword,
                documentation: 'Loop for',
                insertText: 'for ${1:item} in ${2:iterable}:\n\t${3:pass}',
                range: range
            }
        ];
    }

    setupHTMLSupport() {
        // Implementar suporte para HTML
    }

    setupCSSSupport() {
        // Implementar suporte para CSS
    }

    setupJavaSupport() {
        // Implementar suporte para Java
    }

    onContentChange(event) {
        // Atualiza status ou realiza ações na mudança de conteúdo
        this.updateStatusBar();
    }

    onDecorationsChange() {
        // Detecta erros e warnings
        this.highlightErrors();
    }

    updateStatusBar() {
        const position = this.editor.getPosition();
        const lineCount = this.editor.getModel().getLineCount();
        document.getElementById('cursorPosition').textContent = 
            `Linha: ${position.lineNumber}, Coluna: ${position.column}`;
        document.getElementById('lineCount').textContent = 
            `Total: ${lineCount} linhas`;
    }

    highlightErrors() {
        // Implementar destaque de erros específicos
    }

    getDefaultCode(language) {
        const examples = {
            javascript: `// Bem-vindo ao Editor de Código JavaScript!
// Experimente o auto-complete pressionando Ctrl+Espaço

function saudacao(nome) {
    console.log("Olá, " + nome + "!");
    return "Mensagem enviada com sucesso!";
}

// Exemplo de uso
const resultado = saudacao("Mundo");
console.log("Resultado:", resultado);

// Exemplo com array
const numeros = [1, 2, 3, 4, 5];
const dobrados = numeros.map(num => num * 2);
console.log("Números dobrados:", dobrados);`,

            python: `# Bem-vindo ao Editor de Código Python!
# O suporte a Python é simulado via JavaScript

def saudacao(nome):
    print("Olá, " + nome + "!")
    return "Mensagem enviada com sucesso!"

# Exemplo de uso
resultado = saudacao("Mundo")
print("Resultado:", resultado)

# Exemplo com lista
numeros = [1, 2, 3, 4, 5]
dobrados = [num * 2 for num in numeros]
print("Números dobrados:", dobrados)`,

            html: `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Documento HTML</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background-color: #f0f0f0;
        }
        .container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Olá, Mundo!</h1>
        <p>Este é um documento HTML de exemplo.</p>
        <button onclick="alert('Botão clicado!')">Clique-me</button>
    </div>
    
    <script>
        console.log("HTML carregado com sucesso!");
    </script>
</body>
</html>`,

            css: `/* Bem-vindo ao Editor de CSS! */
/* Estilos modernos e responsivos */

:root {
    --primary-color: #007acc;
    --secondary-color: #2d2d30;
    --text-color: #333;
    --background-color: #ffffff;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: var(--background-color);
}

.header {
    background: linear-gradient(135deg, var(--primary-color), #005a9e);
    color: white;
    padding: 2rem;
    text-align: center;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.button {
    background: var(--primary-color);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.button:hover {
    background: #005a9e;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

/* Design responsivo */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    .header {
        padding: 1rem;
    }
}`,

            java: `// Bem-vindo ao Editor de Java!
// Nota: A execução de Java é limitada no navegador

public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Mundo!");
        
        // Exemplo de variáveis e operações
        int numero = 42;
        String mensagem = "O número é: ";
        
        System.out.println(mensagem + numero);
        
        // Exemplo com array
        int[] numeros = {1, 2, 3, 4, 5};
        for (int i = 0; i < numeros.length; i++) {
            System.out.println("Número: " + numeros[i]);
        }
    }
    
    public static int somar(int a, int b) {
        return a + b;
    }
}`
        };

        return examples[language] || examples.javascript;
    }

    changeLanguage(language) {
        this.currentLanguage = language;
        const model = this.editor.getModel();
        monaco.editor.setModelLanguage(model, language);
        
        // Atualiza o código de exemplo
        this.editor.setValue(this.getDefaultCode(language));
        
        this.updateStatusBar();
    }

    getCode() {
        return this.editor.getValue();
    }

    setCode(code) {
        this.editor.setValue(code);
    }

    clear() {
        this.editor.setValue('');
    }

    // Outros métodos utilitários...
}

// Inicializa o editor quando a página carregar
let codeEditor;

document.addEventListener('DOMContentLoaded', function() {
    codeEditor = new CodeEditor();
    codeEditor.initialize();
});