// LIPS拡張: Node.js連携用
module.exports = function (lips) {
    // Node.jsのrequireをLIPSのグローバルに追加（LString→JS string変換）
    lips.env.set('js:require', (mod) => require(mod.valueOf()));
    // 追加で他のNode.js APIやユーティリティ関数もここで定義可能
    // Node.jsのconsole.logをLIPSから使えるように
    lips.env.set('js:console.log', (msg) => console.log(msg));
    // (alias 'newname 'oldname) で別名定義できる関数を追加
    lips.env.set('alias', function (newname, oldname) {
        // 引数チェック: シンボル型のみ許容 (__name__ プロパティ)
        if (!newname || !oldname || typeof newname.__name__ !== 'string' || typeof oldname.__name__ !== 'string') {
            throw new Error("alias: 引数はクォート付きシンボルで指定してください (例: (alias 'lf 'newline))");
        }
        const newStr = newname.__name__;
        const oldStr = oldname.__name__;
        const value = lips.env.get(oldStr);
        lips.env.set(newStr, value);
        return value;
    });

    // EJS wrapper: register(template-name template-string)
    try {
        const path = require('path');
        const ejsWrapper = require(path.join(__dirname, 'ejs-wrapper'));
        const { sexpToEjs } = require(path.join(__dirname, 'sexp-to-ejs'));
        const { sexpToCss } = require(path.join(__dirname, 'sexp-to-css'));

        lips.env.set('ejs:register', function (name, tpl) {
            if (!name || typeof name.valueOf !== 'function') throw new Error('ejs:register requires a name string');
            const key = name.valueOf();
            ejsWrapper.register(key, tpl.valueOf());
            return key;
        });

        // sexp:register — S-expression形式のテンプレートを登録
        // (sexp:register "template-name" '(html (head (title "Page")) (body (h1 "Hello"))))
        lips.env.set('sexp:register', function (name, sexpTemplate) {
            if (!name || typeof name.valueOf !== 'function') throw new Error('sexp:register requires a name string');
            const key = name.valueOf();
            // S-expression を EJS 文字列に変換
            const ejsString = sexpToEjs(sexpTemplate);
            ejsWrapper.register(key, ejsString);
            return key;
        });

        // ejs:render(template-name ctx-json)
        lips.env.set('ejs:render', function (name, ctxJson) {
            const key = name.valueOf();
            const ctx = JSON.parse(ctxJson.valueOf());
            return ejsWrapper.render(key, ctx);
        });

        // CSS registry (in-memory)
        const cssRegistry = new Map();
        // CSS 変数レジストリ（色定数など）
        const cssVars = new Map();

        // css:register — S-expression形式のCSSを登録
        // (css:register "style-name" '(("body" ("margin" "0")) (".header" ("color" "blue"))))
        lips.env.set('css:register', function (name, sexpCss) {
            if (!name || typeof name.valueOf !== 'function') throw new Error('css:register requires a name string');
            const key = name.valueOf();
            // S-expression を CSS 文字列に変換（現在の cssVars を渡す）
            const cssString = sexpToCss(sexpCss, '', cssVars);
            cssRegistry.set(key, cssString);
            return key;
        });

        // css:render — 登録されたCSSを取得
        // (css:render "style-name")
        lips.env.set('css:render', function (name) {
            const key = name.valueOf();
            if (!cssRegistry.has(key)) {
                throw new Error(`CSS '${key}' not registered`);
            }
            return cssRegistry.get(key);
        });

        // css:define-var — 色などの変数を定義
        // (css:define-var "primary" "#667eea")
        lips.env.set('css:define-var', function (name, value) {
            if (!name || typeof name.valueOf !== 'function') throw new Error('css:define-var requires a name string');
            const key = name.valueOf();
            const val = (value && typeof value.valueOf === 'function') ? value.valueOf() : String(value);
            cssVars.set(key, val);
            return key;
        });

        // css:get-var — 変数を取得
        // (css:get-var "primary") -> "#667eea"
        lips.env.set('css:get-var', function (name) {
            const key = name.valueOf();
            return cssVars.get(key);
        });

    } catch (e) {
        console.error('Failed to load EJS/S-exp template support:', e.message);
    }
};
