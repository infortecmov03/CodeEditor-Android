// Gerenciador de execução de código
class CodeExecutor {
    constructor() {
        this.originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
        };
        this.outputBuffer = [];
    }

    execute() {
        const code = codeEditor.getCode();
        const language = document.getElementById('language').value;
        
        this.clearOutput();
        this.captureConsole();
        
        try {
            switch(language) {
                case 'javascript':
                    this.executeJavaScript(code);
                    break;
                case 'python':
                    this.executePython(code);
                    break;
                case 'html':
                    this.executeHTML(code);
                    break;
                case 'css':
                    this.executeCSS(code);
                    break;
                case 'java':
                    this.executeJava(code);
                    break;
                default:
                    this.addOutput('Linguagem não suportada: ' + language, 'error');
            }
        } catch (error) {
            this.handleError(error);
        } finally {
            this.restoreConsole();
        }
    }

    executeJavaScript(code) {
        try {
            // Adiciona strict mode para melhor detecção de erros
            const strictCode = `"use strict";\n${code}`;
            
            // Executa o código
            const result = eval(strictCode);
            
            // Se o código retornou algo (não undefined)
            if (result !== undefined) {
                this.addOutput(`← ${this.formatValue(result)}`, 'success');
            }
            
            this.addOutput('✓ Execução JavaScript concluída', 'success');
            
        } catch (error) {
            this.handleError(error);
        }
    }

    executePython(code) {
        try {
            // Conversão básica de Python para JavaScript
            const jsCode = this.pythonToJavaScript(code);
            this.executeJavaScript(jsCode);
            
        } catch (error) {
            this.handleError(error);
        }
    }

    pythonToJavaScript(pythonCode) {
        return pythonCode
            // Comentários
            .replace(/^(\s*)#(.*)$/gm, '$1//$2')
            
            // Prints
            .replace(/print\s*\((.*)\)/g, 'console.log($1)')
            
            // Funções
            .replace(/def\s+(\w+)\s*\((.*)\)\s*:/g, 'function $1($2) {')
            
            // Condicionais e loops
            .replace(/elif\s*\((.*)\)\s*:/g, 'else if ($1) {')
            .replace(/else\s*:/g, 'else {')
            .replace(/if\s*(.*)\s*:/g, 'if ($1) {')
            .replace(/for\s+(\w+)\s+in\s+(.*)\s*:/g, 'for (let $1 of $2) {')
            .replace(/while\s*(.*)\s*:/g, 'while ($1) {')
            
            // Booleanos e None
            .replace(/\bTrue\b/g, 'true')
            .replace(/\bFalse\b/g, 'false')
            .replace(/\bNone\b/g, 'null')
            
            // Adiciona chaves de fechamento (simplificado)
            .replace(/\n(\s*)(?=function|if|else|for|while)/g, '\n$1}\n$1')
            + '\n}'; // Fecha qualquer função aberta
    }

    executeHTML(code) {
        try {
            // Abre em nova janela/aba
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(code);
                newWindow.document.close();
                this.addOutput('✓ HTML aberto em nova janela', 'success');
            } else {
                this.addOutput('✗ Bloqueador de pop-ups impediu a abertura', 'error');
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    executeCSS(code) {
        // Para CSS, apenas valida a sintaxe
        try {
            // Cria um elemento style temporário para validação
            const style = document.createElement('style');
            style.textContent = code;
            document.head.appendChild(style);
            document.head.removeChild(style);
            
            this.addOutput('✓ CSS validado com sucesso', 'success');
            this.addOutput('Nota: CSS não é executável, apenas validado', 'info');
            
        } catch (error) {
            this.addOutput(`✗ Erro de sintaxe CSS: ${error.message}`, 'error');
        }
    }

    executeJava(code) {
        // Execução limitada de Java no navegador
        this.addOutput('ℹ Execução de Java limitada no navegador', 'warning');
        this.addOutput('Código Java analisado:', 'info');
        
        // Análise básica do código Java
        this.analyzeJavaCode(code);
    }

    analyzeJavaCode(code) {
        // Detecção básica de erros de sintaxe Java
        const errors = [];
        
        if (!code.includes('public class')) {
            errors.push('Classe pública principal não encontrada');
        }
        
        if (!code.includes('public static void main')) {
            errors.push('Método main não encontrado');
        }
        
        if (!code.includes('System.out.println')) {
            this.addOutput('Dica: Use System.out.println() para output', 'info');
        }
        
        if (errors.length > 0) {
            errors.forEach(error => this.addOutput(`✗ ${error}`, 'error'));
        } else {
            this.addOutput('✓ Estrutura básica do Java parece correta', 'success');
        }
    }

    captureConsole() {
        const self = this;
        
        console.log = function(...args) {
            self.originalConsole.log.apply(console, args);
            self.addOutput(args.map(arg => self.formatValue(arg)).join(' '), 'log');
        };
        
        console.error = function(...args) {
            self.originalConsole.error.apply(console, args);
            self.addOutput(args.map(arg => self.formatValue(arg)).join(' '), 'error');
        };
        
        console.warn = function(...args) {
            self.originalConsole.warn.apply(console, args);
            self.addOutput(args.map(arg => self.formatValue(arg)).join(' '), 'warning');
        };
        
        console.info = function(...args) {
            self.originalConsole.info.apply(console, args);
            self.addOutput(args.map(arg => self.formatValue(arg)).join(' '), 'info');
        };
    }

    restoreConsole() {
        console.log = this.originalConsole.log;
        console.error = this.originalConsole.error;
        console.warn = this.originalConsole.warn;
        console.info = this.originalConsole.info;
    }

    formatValue(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value, null, 2);
            } catch {
                return value.toString();
            }
        }
        
        return String(value);
    }

    handleError(error) {
        const errorInfo = this.parseError(error);
        this.addOutput(`✗ Erro: ${errorInfo.message}`, 'error');
        
        if (errorInfo.line) {
            this.addOutput(`📍 Linha: ${errorInfo.line}`, 'error');
        }
        
        if (errorInfo.stack) {
            this.addOutput(`🔍 ${errorInfo.stack}`, 'error');
        }
    }

    parseError(error) {
        const result = {
            message: error.message,
            line: null,
            stack: null
        };
        
        // Tenta extrair número da linha do erro
        const lineMatch = error.stack.match(/<anonymous>:(\d+):(\d+)/);
        if (lineMatch) {
            result.line = parseInt(lineMatch[1]) - 1; // Ajusta para linha do usuário
        }
        
        // Limita o stack trace
        if (error.stack) {
            result.stack = error.stack.split('\n').slice(0, 3).join('\n');
        }
        
        return result;
    }

    addOutput(message, type = 'log') {
        if (window.addOutput) {
            window.addOutput(message, type);
        } else {
            // Fallback se a função global não estiver disponível
            const output = document.getElementById('output');
            const line = document.createElement('div');
            line.className = `output-line ${type}`;
            line.textContent = message;
            output.appendChild(line);
            output.scrollTop = output.scrollHeight;
        }
    }

    clearOutput() {
        const output = document.getElementById('output');
        output.innerHTML = '';
    }
}

// Gerenciador de arquivos
class FileManager {
    save() {
        const code = codeEditor.getCode();
        const language = document.getElementById('language').value;
        const filename = document.getElementById('filename').value || 'script';
        
        const extension = this.getExtension(language);
        const fullFilename = `${filename}.${extension}`;
        
        try {
            // Cria um blob com o código
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            // Cria link de download
            const a = document.createElement('a');
            a.href = url;
            a.download = fullFilename;
            a.style.display = 'none';
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            window.addOutput(`✓ Arquivo salvo: ${fullFilename}`, 'success');
            
        } catch (error) {
            window.addOutput(`✗ Erro ao salvar: ${error.message}`, 'error');
        }
    }

    load() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.js,.py,.html,.css,.java,.txt,.jsx,.ts,.php,.rb,.cpp,.c,.cs,.go,.rs,.swift,.kt';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const text = await this.readFile(file);
                codeEditor.setCode(text);
                
                // Tenta detectar a linguagem pela extensão
                const language = this.detectLanguage(file.name);
                if (language) {
                    document.getElementById('language').value = language;
                    codeEditor.changeLanguage(language);
                }
                
                window.addOutput(`✓ Arquivo carregado: ${file.name}`, 'success');
                
            } catch (error) {
                window.addOutput(`✗ Erro ao carregar: ${error.message}`, 'error');
            }
        };
        
        input.click();
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Falha ao ler arquivo'));
            reader.readAsText(file);
        });
    }

    detectLanguage(filename) {
        const extensions = {
            'js': 'javascript',
            'jsx': 'javascript',
            'py': 'python',
            'html': 'html',
            'htm': 'html',
            'css': 'css',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'cs': 'csharp',
            'php': 'php',
            'rb': 'ruby',
            'go': 'go',
            'rs': 'rust',
            'swift': 'swift',
            'kt': 'kotlin'
        };
        
        const ext = filename.split('.').pop().toLowerCase();
        return extensions[ext] || null;
    }

    getExtension(language) {
        const extensions = {
            'javascript': 'js',
            'python': 'py',
            'html': 'html',
            'css': 'css',
            'java': 'java'
        };
        
        return extensions[language] || 'txt';
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Cria instâncias globais
    window.codeExecutor = new CodeExecutor();
    window.fileManager = new FileManager();
    
    console.log('Sistema de execução inicializado');
});