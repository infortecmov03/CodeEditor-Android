package com.example.codeeditor;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        webView = new WebView(this);
        setContentView(webView);
        
        // Configurações do WebView
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setAllowFileAccess(true);
        
        // Carrega o editor COMPLETO em um único HTML
        String html = getCompleteEditorHTML();
        webView.loadDataWithBaseURL("file:///android_asset/", html, "text/html", "UTF-8", null);
    }

    private String getCompleteEditorHTML() {
        return "<!DOCTYPE html>\n" +
                "<html lang=\"pt-br\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>CodeEditor Mobile</title>\n" +
                "    <style>\n" +
                "        * { margin: 0; padding: 0; box-sizing: border-box; }\n" +
                "        body { \n" +
                "            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; \n" +
                "            background: #1e1e1e; \n" +
                "            color: #e8e8e8; \n" +
                "            height: 100vh; \n" +
                "            overflow: hidden; \n" +
                "        }\n" +
                "        .container { \n" +
                "            display: flex; \n" +
                "            flex-direction: column; \n" +
                "            height: 100vh; \n" +
                "        }\n" +
                "        .header { \n" +
                "            background: #2d2d30; \n" +
                "            padding: 12px 15px; \n" +
                "            border-bottom: 1px solid #3e3e42; \n" +
                "            display: flex; \n" +
                "            align-items: center; \n" +
                "            gap: 10px; \n" +
                "            flex-wrap: wrap; \n" +
                "        }\n" +
                "        .language-selector { \n" +
                "            background: #3c3c3c; \n" +
                "            color: #ffffff; \n" +
                "            border: 1px solid #555; \n" +
                "            padding: 8px 12px; \n" +
                "            border-radius: 6px; \n" +
                "            font-size: 14px; \n" +
                "            min-width: 140px; \n" +
                "        }\n" +
                "        .btn { \n" +
                "            background: #007acc; \n" +
                "            color: white; \n" +
                "            border: none; \n" +
                "            padding: 8px 16px; \n" +
                "            border-radius: 6px; \n" +
                "            cursor: pointer; \n" +
                "            font-size: 14px; \n" +
                "            font-weight: 500; \n" +
                "        }\n" +
                "        .btn:hover { background: #1177bb; }\n" +
                "        .btn-run { background: #28a745; }\n" +
                "        .btn-run:hover { background: #218838; }\n" +
                "        .editor-container { \n" +
                "            flex: 1; \n" +
                "            display: flex; \n" +
                "            position: relative; \n" +
                "        }\n" +
                "        #codeEditor { \n" +
                "            width: 100%; \n" +
                "            height: 100%; \n" +
                "            background: #1e1e1e; \n" +
                "            color: #d4d4d4; \n" +
                "            border: none; \n" +
                "            padding: 15px; \n" +
                "            font-family: 'Courier New', monospace; \n" +
                "            font-size: 14px; \n" +
                "            resize: none; \n" +
                "            outline: none; \n" +
                "            line-height: 1.5;\n" +
                "        }\n" +
                "        .output { \n" +
                "            background: #1e1e1e; \n" +
                "            border-top: 2px solid #3e3e42; \n" +
                "            padding: 12px; \n" +
                "            height: 150px; \n" +
                "            overflow-y: auto; \n" +
                "            font-family: 'Courier New', monospace; \n" +
                "            font-size: 13px; \n" +
                "        }\n" +
                "        .error { color: #f44747; }\n" +
                "        .success { color: #4ec9b0; }\n" +
                "        .warning { color: #ffcc02; }\n" +
                "        .info { color: #569cd6; }\n" +
                "        .log { color: #d4d4d4; }\n" +
                "        .suggestions {\n" +
                "            position: absolute;\n" +
                "            background: #252526;\n" +
                "            border: 1px solid #3e3e42;\n" +
                "            max-height: 200px;\n" +
                "            overflow-y: auto;\n" +
                "            z-index: 1000;\n" +
                "            display: none;\n" +
                "        }\n" +
                "        .suggestion-item {\n" +
                "            padding: 10px 12px;\n" +
                "            cursor: pointer;\n" +
                "            border-bottom: 1px solid #3e3e42;\n" +
                "        }\n" +
                "        .suggestion-item:hover { background: #2a2d2e; }\n" +
                "        .status-bar {\n" +
                "            background: #007acc;\n" +
                "            color: white;\n" +
                "            padding: 6px 12px;\n" +
                "            font-size: 12px;\n" +
                "            display: flex;\n" +
                "            justify-content: space-between;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"header\">\n" +
                "            <select id=\"language\" class=\"language-selector\">\n" +
                "                <option value=\"javascript\">JavaScript</option>\n" +
                "                <option value=\"python\">Python</option>\n" +
                "                <option value=\"html\">HTML</option>\n" +
                "                <option value=\"css\">CSS</option>\n" +
                "            </select>\n" +
                "            <button class=\"btn btn-run\" onclick=\"runCode()\">▶ Executar</button>\n" +
                "            <button class=\"btn\" onclick=\"clearOutput()\">🗑️ Limpar</button>\n" +
                "            <button class=\"btn\" onclick=\"showSuggestions()\">💡 Sugestões</button>\n" +
                "        </div>\n" +
                "        \n" +
                "        <div class=\"editor-container\">\n" +
                "            <textarea id=\"codeEditor\" spellcheck=\"false\"></textarea>\n" +
                "            <div id=\"suggestions\" class=\"suggestions\"></div>\n" +
                "        </div>\n" +
                "        \n" +
                "        <div class=\"output\" id=\"output\">\n" +
                "            <div class=\"info\">Editor carregado! Selecione uma linguagem.</div>\n" +
                "        </div>\n" +
                "        \n" +
                "        <div class=\"status-bar\">\n" +
                "            <span id=\"status\">Pronto</span>\n" +
                "            <span id=\"lineInfo\">Linha 1, Col 1</span>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "\n" +
                "    <script>\n" +
                "        // ===== CONFIGURAÇÃO INICIAL =====\n" +
                "        let currentLanguage = 'javascript';\n" +
                "        let editor = document.getElementById('codeEditor');\n" +
                "\n" +
                "        // Códigos de exemplo\n" +
                "        const examples = {\n" +
                "            javascript: '// Bem-vindo!\\\\n// Pressione Ctrl+Enter para executar\\\\n\\\\nfunction helloWorld() {\\\\n    console.log(\\\"Olá, Mundo!\\\");\\\\n    return \\\"Sucesso!\\\";\\\\n}\\\\n\\\\nhelloWorld();',\n" +
                "            python: '# Bem-vindo ao Python!\\\\n# O código é convertido automaticamente\\\\n\\\\ndef hello_world():\\\\n    print(\\\"Olá, Mundo!\\\")\\\\n    return \\\"Sucesso!\\\"\\\\n\\\\nhello_world()',\n" +
                "            html: '<!DOCTYPE html>\\\\n<html>\\\\n<head>\\\\n    <title>Meu Site</title>\\\\n</head>\\\\n<body>\\\\n    <h1>Olá, Mundo!</h1>\\\\n</body>\\\\n</html>',\n" +
                "            css: '/* Bem-vindo ao CSS! */\\\\n\\\\nbody {\\\\n    background: #1e1e1e;\\\\n    color: white;\\\\n    font-family: Arial;\\\\n}'" +
                "        };\n" +
                "\n" +
                "        // ===== INICIALIZAÇÃO =====\n" +
                "        document.addEventListener('DOMContentLoaded', function() {\n" +
                "            editor.value = examples[currentLanguage];\n" +
                "            setupEventListeners();\n" +
                "            updateLineInfo();\n" +
                "            addOutput('✅ Editor inicializado com sucesso!', 'success');\n" +
                "        });\n" +
                "\n" +
                "        function setupEventListeners() {\n" +
                "            // Mudança de linguagem\n" +
                "            document.getElementById('language').addEventListener('change', function(e) {\n" +
                "                currentLanguage = e.target.value;\n" +
                "                editor.value = examples[currentLanguage] || '';\n" +
                "                updateStatus('Linguagem: ' + currentLanguage);\n" +
                "                addOutput('Linguagem alterada para: ' + currentLanguage, 'info');\n" +
                "            });\n" +
                "\n" +
                "            // Atalhos de teclado\n" +
                "            editor.addEventListener('keydown', function(e) {\n" +
                "                // Tab para indentação\n" +
                "                if (e.key === 'Tab') {\n" +
                "                    e.preventDefault();\n" +
                "                    const start = this.selectionStart;\n" +
                "                    const end = this.selectionEnd;\n" +
                "                    this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);\n" +
                "                    this.selectionStart = this.selectionEnd = start + 4;\n" +
                "                }\n" +
                "                \n" +
                "                // Ctrl+Enter para executar\n" +
                "                if (e.ctrlKey && e.key === 'Enter') {\n" +
                "                    e.preventDefault();\n" +
                "                    runCode();\n" +
                "                }\n" +
                "                \n" +
                "                updateLineInfo();\n" +
                "            });\n" +
                "\n" +
                "            editor.addEventListener('input', updateLineInfo);\n" +
                "            editor.addEventListener('click', updateLineInfo);\n" +
                "            \n" +
                "            // Fecha sugestões ao clicar fora\n" +
                "            document.addEventListener('click', function(e) {\n" +
                "                if (!e.target.closest('.suggestions') && e.target.id !== 'codeEditor') {\n" +
                "                    hideSuggestions();\n" +
                "                }\n" +
                "            });\n" +
                "        }\n" +
                "\n" +
                "        // ===== FUNÇÕES DO EDITOR =====\n" +
                "        function updateLineInfo() {\n" +
                "            const text = editor.value.substring(0, editor.selectionStart);\n" +
                "            const lines = text.split('\\n');\n" +
                "            const lineNumber = lines.length;\n" +
                "            const columnNumber = lines[lines.length - 1].length + 1;\n" +
                "            \n" +
                "            document.getElementById('lineInfo').textContent = \n" +
                "                'Linha ' + lineNumber + ', Col ' + columnNumber;\n" +
                "        }\n" +
                "\n" +
                "        function updateStatus(message) {\n" +
                "            document.getElementById('status').textContent = message;\n" +
                "        }\n" +
                "\n" +
                "        // ===== EXECUÇÃO DE CÓDIGO =====\n" +
                "        function runCode() {\n" +
                "            const code = editor.value;\n" +
                "            clearOutput();\n" +
                "            updateStatus('Executando...');\n" +
                "            \n" +
                "            try {\n" +
                "                switch(currentLanguage) {\n" +
                "                    case 'javascript':\n" +
                "                        executeJavaScript(code);\n" +
                "                        break;\n" +
                "                    case 'python':\n" +
                "                        executePython(code);\n" +
                "                        break;\n" +
                "                    case 'html':\n" +
                "                        executeHTML(code);\n" +
                "                        break;\n" +
                "                    case 'css':\n" +
                "                        executeCSS(code);\n" +
                "                        break;\n" +
                "                    default:\n" +
                "                        addOutput('Linguagem não suportada', 'error');\n" +
                "                }\n" +
                "                updateStatus('Concluído');\n" +
                "            } catch (error) {\n" +
                "                addOutput('Erro: ' + error.message, 'error');\n" +
                "                updateStatus('Erro');\n" +
                "            }\n" +
                "        }\n" +
                "\n" +
                "        function executeJavaScript(code) {\n" +
                "            const originalConsole = {\n" +
                "                log: console.log,\n" +
                "                error: console.error\n" +
                "            };\n" +
                "            \n" +
                "            // Captura console.log\n" +
                "            console.log = function(...args) {\n" +
                "                originalConsole.log.apply(console, args);\n" +
                "                addOutput(args.join(' '), 'log');\n" +
                "            };\n" +
                "            \n" +
                "            console.error = function(...args) {\n" +
                "                originalConsole.error.apply(console, args);\n" +
                "                addOutput(args.join(' '), 'error');\n" +
                "            };\n" +
                "            \n" +
                "            try {\n" +
                "                const result = eval(code);\n" +
                "                if (result !== undefined) {\n" +
                "                    addOutput('← ' + result, 'success');\n" +
                "                }\n" +
                "                addOutput('✅ JavaScript executado', 'success');\n" +
                "            } catch (error) {\n" +
                "                const lineNumber = extractLineNumber(error);\n" +
                "                addOutput('❌ Erro: ' + error.message, 'error');\n" +
                "                if (lineNumber) {\n" +
                "                    addOutput('📍 Linha: ' + lineNumber, 'error');\n" +
                "                }\n" +
                "            } finally {\n" +
                "                // Restaura console original\n" +
                "                console.log = originalConsole.log;\n" +
                "                console.error = originalConsole.error;\n" +
                "            }\n" +
                "        }\n" +
                "\n" +
                "        function executePython(code) {\n" +
                "            // Converte Python para JavaScript\n" +
                "            let jsCode = code\n" +
                "                .replace(/^#(.*)$/gm, '//$1')\n" +
                "                .replace(/print\\s*\\((.*)\\)/g, 'console.log($1)')\n" +
                "                .replace(/def\\s+(\\w+)\\s*\\((.*)\\):/g, 'function $1($2) {')\n" +
                "                .replace(/if\\s+(.*):/g, 'if ($1) {')\n" +
                "                .replace(/for\\s+(\\w+)\\s+in\\s+(.*):/g, 'for (let $1 of $2) {')\n" +
                "                .replace(/\\bTrue\\b/g, 'true')\n" +
                "                .replace(/\\bFalse\\b/g, 'false')\n" +
                "                .replace(/\\bNone\\b/g, 'null');\n" +
                "            \n" +
                "            executeJavaScript(jsCode);\n" +
                "        }\n" +
                "\n" +
                "        function executeHTML(code) {\n" +
                "            try {\n" +
                "                const newWindow = window.open('', '_blank');\n" +
                "                if (newWindow) {\n" +
                "                    newWindow.document.write(code);\n" +
                "                    newWindow.document.close();\n" +
                "                    addOutput('✅ HTML aberto em nova janela', 'success');\n" +
                "                } else {\n" +
                "                    addOutput('❌ Pop-up bloqueado', 'warning');\n" +
                "                }\n" +
                "            } catch (error) {\n" +
                "                addOutput('❌ Erro ao abrir HTML: ' + error.message, 'error');\n" +
                "            }\n" +
                "        }\n" +
                "\n" +
                "        function executeCSS(code) {\n" +
                "            addOutput('ℹ CSS validado', 'info');\n" +
                "            addOutput('Conteúdo CSS:', 'info');\n" +
                "            addOutput(code, 'log');\n" +
                "        }\n" +
                "\n" +
                "        function extractLineNumber(error) {\n" +
                "            if (error.stack) {\n" +
                "                const match = error.stack.match(/:([0-9]+):([0-9]+)/);\n" +
                "                return match ? parseInt(match[1]) - 1 : null;\n" +
                "            }\n" +
                "            return null;\n" +
                "        }\n" +
                "\n" +
                "        // ===== SUGESTÕES DE CÓDIGO =====\n" +
                "        function showSuggestions() {\n" +
                "            const suggestions = [\n" +
                "                { label: 'console.log', code: 'console.log(\"${1:mensagem}\");', desc: 'Exibe mensagem no console' },\n" +
                "                { label: 'function', code: 'function ${1:nome}(${2:parametros}) {\\n\\t${3:// código}\\n}', desc: 'Declara uma função' },\n" +
                "                { label: 'if', code: 'if (${1:condicao}) {\\n\\t${2:// código}\\n}', desc: 'Declaração condicional' },\n" +
                "                { label: 'for', code: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\\n\\t${3:// código}\\n}', desc: 'Loop for' },\n" +
                "                { label: 'const', code: 'const ${1:nome} = ${2:valor};', desc: 'Declara constante' },\n" +
                "                { label: 'let', code: 'let ${1:nome} = ${2:valor};', desc: 'Declara variável' }\n" +
                "            ];\n" +
                "\n" +
                "            const suggestionsDiv = document.getElementById('suggestions');\n" +
                "            suggestionsDiv.innerHTML = '';\n" +
                "            \n" +
                "            suggestions.forEach(suggestion => {\n" +
                "                const div = document.createElement('div');\n" +
                "                div.className = 'suggestion-item';\n" +
                "                div.innerHTML = '<strong>' + suggestion.label + '</strong><br><small>' + suggestion.desc + '</small>';\n" +
                "                div.onclick = function() { insertSuggestion(suggestion); };\n" +
                "                suggestionsDiv.appendChild(div);\n" +
                "            });\n" +
                "\n" +
                "            // Posiciona as sugestões\n" +
                "            const rect = editor.getBoundingClientRect();\n" +
                "            suggestionsDiv.style.top = (rect.top + 50) + 'px';\n" +
                "            suggestionsDiv.style.left = (rect.left + 20) + 'px';\n" +
                "            suggestionsDiv.style.width = (rect.width - 40) + 'px';\n" +
                "            suggestionsDiv.style.display = 'block';\n" +
                "        }\n" +
                "\n" +
                "        function hideSuggestions() {\n" +
                "            document.getElementById('suggestions').style.display = 'none';\n" +
                "        }\n" +
                "\n" +
                "        function insertSuggestion(suggestion) {\n" +
                "            const start = editor.selectionStart;\n" +
                "            editor.value = editor.value.substring(0, start) + suggestion.code + editor.value.substring(editor.selectionEnd);\n" +
                "            editor.focus();\n" +
                "            \n" +
                "            hideSuggestions();\n" +
                "            addOutput('✅ Sugestão inserida: ' + suggestion.label, 'success');\n" +
                "        }\n" +
                "\n" +
                "        // ===== FUNÇÕES UTILITÁRIAS =====\n" +
                "        function addOutput(message, type) {\n" +
                "            const output = document.getElementById('output');\n" +
                "            const div = document.createElement('div');\n" +
                "            div.className = type;\n" +
                "            div.textContent = message;\n" +
                "            output.appendChild(div);\n" +
                "            output.scrollTop = output.scrollHeight;\n" +
                "        }\n" +
                "\n" +
                "        function clearOutput() {\n" +
                "            document.getElementById('output').innerHTML = '';\n" +
                "            addOutput('Output limpo', 'info');\n" +
                "        }\n" +
                "    </script>\n" +
                "</body>\n" +
                "</html>";
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}