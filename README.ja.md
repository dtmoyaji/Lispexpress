# LIPS Fullstack Web Framework

**サーバーからクライアントまで、すべてLispで書けるWebフレームワーク** 🚀

LIPS (Lisp in JavaScript) を使用して、Node.js サーバーサイドとブラウザクライアントサイドの両方でLispコードを実行できます。HTML、CSS、JavaScriptのすべてをS-expression形式で記述し、完全なフルスタックLisp開発を実現します。

## 開発の動機

### なぜLispでWebアプリケーションを？

1. **HTMLとLispの親和性**: HTMLはツリー構造を持つため、ツリー構造を自然に表現できるLispのS-expressionと相性が抜群です。`<div><p>Hello</p></div>` は `(div (p "Hello"))` として表現でき、コードとして扱いやすくなります。

2. **開発言語の統一**: バックエンドとフロントエンドで異なる言語を使うと、開発者の認知的負荷が高まります。LIPSを使えば、サーバーサイドもクライアントサイドも同じLispで書けるため、以下のメリットがあります：
   - コンテキストスイッチングの削減
   - コードの再利用性向上
   - 学習コストの削減
   - 統一されたコーディングスタイル

3. **S-expressionの力**: HTMLやCSSをS-expressionで表現することで、マクロやメタプログラミングの恩恵を受けられます。テンプレートやスタイルの生成を関数として抽象化し、再利用可能なコンポーネントを簡単に作成できます。

## 特徴

### 🖥️ サーバーサイド (Node.js + LIPS)

- **Express.js統合**: Lispでルーティングとミドルウェアを定義
- **S-expression → EJS**: HTMLテンプレートをLispで記述
- **S-expression → CSS**: スタイルシートをLispで記述、CSS変数もサポート
- **Node.js API**: `js:require` で任意のNode.jsモジュールを使用可能

### 🌐 クライアントサイド (Browser + LIPS)

- **ブラウザでLisp実行**: CDN経由でLIPSをロード、クライアントサイドでもLispが動作
- **DOM操作**: Lispから直接DOM APIを呼び出し
- **イベントハンドラ**: Lispで記述可能
- **動的HTML生成**: S-expressionからHTML文字列を生成

### 🎨 完全なLispエコシステム

```text
Lisp → HTML (EJS)
Lisp → CSS
Lisp → Server Logic (Express)
Lisp → Client Logic (Browser)
```

## セットアップ

### 1. 依存関係のインストール

```cmd
npm install
```

必要なパッケージ:

- `lips`: Lisp処理系
- `express`: Webサーバー
- `ejs`: テンプレートエンジン

### 2. サーバー起動

```cmd
node bin/run.js lisp/express.lisp
```

サーバーが `http://localhost:3000` で起動します。

## 使い方

### REPL起動（対話モード）

```cmd
node bin/run.js
```

### Lispファイル実行

```cmd
node bin/run.js <ファイルパス>
```

## サンプルページ

サーバー起動後、以下のURLにアクセス可能:

### 📚 サーバーサイドレンダリング (Lisp定義テンプレート)

- `http://localhost:3000/server` - シンプルなページ
- `http://localhost:3000/user` - 変数展開
- `http://localhost:3000/admin` - 条件分岐
- `http://localhost:3000/items` - リストループ
- `http://localhost:3000/styled` - スタイル付きページ
- `http://localhost:3000/styled-user` - スタイル付きユーザーページ
- `http://localhost:3000/styled-items` - スタイル付きアイテムリスト

### 🌐 クライアントサイドLisp

- `http://localhost:3000/demo` - **ブラウザLisp REPL** (対話実行環境)
  - ブラウザ内でLispコードを実行
  - DOM操作、数値計算、リスト処理のサンプル付き

### 🎨 スタイルシート

- `http://localhost:3000/styles.css` - Lisp定義CSS

## コード例

### 1. サーバー定義 (Express + Lisp)

`lisp/express.lisp`:

```lisp
(define app (express))

;; ルート定義
(app.get "/demo" (lambda (req res)
  (define html (ejs:render "browser-lisp-demo" "{}"))
  (res.send html)))

;; サーバー起動
(app.listen 3000 (lambda ()
  (js:console.log "Server running on http://localhost:3000")))
```

### 2. HTMLテンプレート定義 (S-expression → EJS)

`lisp/parts/browser-demo.lisp`:

```lisp
(sexp:register "browser-lisp-demo"
  `(html (@ "lang" "ja")
     (head
       (meta (@ "charset" "UTF-8"))
       (title "LIPS Demo"))
     (body
       (div (@ "class" "container")
         (h1 "Hello from Lisp!")
         (p "This page is generated from S-expressions")))))
```

#### サポートする構文:

- `(tag ...)` → `<tag>...</tag>`
- `(tag (@ "key" "val") ...)` → `<tag key="val">...</tag>`
- `($ expr)` → `<%= expr %>` (EJS変数展開)
- `($raw expr)` → 生HTML埋め込み
- `(if cond then else)` → EJS条件分岐
- `(for var in arr body)` → EJSループ

### 3. CSSスタイル定義 (S-expression → CSS)

`lisp/styles.lisp`:

```lisp
;; CSS変数定義
(css:define-var "primary" "#667eea")
(css:define-var "secondary" "#764ba2")

;; スタイル定義
(css:register "main-styles"
  '(("body" ("margin" "0") ("padding" "0"))
    (".container" 
      ("max-width" "1200px")
      ("margin" "0 auto"))
    (".header"
      ("background" "linear-gradient(135deg, var(primary) 0%, var(secondary) 100%)")
      ("color" "white")
      ("padding" "2rem"))))
```

#### サポートする構文:

- `("selector" ("prop" "value") ...)` → CSS ルール
- `("@media" "query" (...))` → メディアクエリ
- `("keyframes" "name" (...))` → アニメーション
- `var(name)` → CSS変数参照

### 4. クライアントサイドLisp (ブラウザで実行)

```lisp
;; DOM操作
(define output (document.getElementById "output"))
(element.innerHTML! output "<h1>Hello from Browser Lisp!</h1>")

;; 関数定義
(define (factorial n)
  (if (<= n 1)
      1
      (* n (factorial (- n 1)))))

;; 実行
(console.log "5の階乗:" (factorial 5))
```

### 5. Node.js APIの直接使用

```lisp
;; fsモジュールを取得
(define fs (js:require "fs"))

;; ファイル読み込み
(define content (fs.readFileSync "package.json" "utf8"))
(js:console.log content)

;; pathモジュール
(define path (js:require "path"))
(define fullpath (path.join __dirname "bin" "run.js"))
```

## プロジェクト構成

```text
lesson1/
├── bin/
│   ├── run.js              # エントリーポイント
│   ├── ext.js              # LIPS拡張（Node.js連携、テンプレート機能）
│   ├── ejs-wrapper.js      # EJSテンプレートレジストリ
│   ├── sexp-to-ejs.js      # S-expression → EJS 変換
│   └── sexp-to-css.js      # S-expression → CSS 変換
├── lisp/
│   ├── alias.lisp          # エイリアス定義
│   ├── define.lisp         # Node.jsモジュール読み込み
│   ├── styles.lisp         # CSS定義
│   ├── templates.lisp      # HTMLテンプレート定義
│   ├── express.lisp        # Expressアプリケーション
│   └── parts/
│       └── browser-demo.lisp  # ブラウザREPLページ
├── public/                 # 静的ファイル（参考用の旧index.html）
├── package.json
└── README.md
```

## アーキテクチャ

### データフロー

```text
┌─────────────────────────────────────────────┐
│  Lisp Source Code (.lisp ファイル)          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  LIPS Interpreter (Node.js)                 │
│  - S-expression パース                       │
│  - 式評価・関数実行                          │
└─────────────┬───────────────┬───────────────┘
              │               │
      ┌───────▼─────┐  ┌──────▼──────┐
      │ sexp-to-ejs │  │ sexp-to-css │
      │   変換       │  │   変換       │
      └───────┬─────┘  └──────┬──────┘
              │               │
         ┌────▼────┐     ┌────▼────┐
         │   EJS   │     │   CSS   │
         └────┬────┘     └────┬────┘
              │               │
              └───────┬───────┘
                      ▼
              ┌───────────────┐
              │  HTTP Response │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │    Browser    │
              │  + LIPS (CDN) │
              └───────────────┘
```

### サーバーサイド vs クライアントサイド

| 機能 | サーバーサイド (Node.js) | クライアントサイド (Browser) |
|------|-------------------------|------------------------------|
| **Lisp処理系** | LIPS (npm package) | LIPS (CDN) |
| **実行環境** | Node.js | ブラウザJavaScript |
| **API** | Node.js API (`fs`, `path`, etc) | Browser API (`document`, `window`, etc) |
| **用途** | ルーティング、テンプレート生成、CSS生成 | DOM操作、イベント処理、UI更新 |
| **出力** | HTML/CSS文字列 | 実行時DOM変更 |

### 両方で共通して使える機能

- ✅ Lisp基本構文 (define, lambda, if, let, etc)
- ✅ 数値演算・リスト操作
- ✅ 関数定義・高階関数
- ✅ マクロ（LIPS対応範囲内）

## 技術スタック

- **Lisp処理系**: [LIPS](https://lips.js.org/) v1.0.0-beta.20
- **Webサーバー**: Express.js
- **テンプレートエンジン**: EJS
- **ランタイム**: Node.js (サーバー) + Modern Browser (クライアント)

## 今後の拡張可能性

- [ ] コンポーネントシステム（再利用可能なUI部品）
- [ ] CSSプリプロセッサ機能（ネスト、ミックスイン）
- [ ] ファイルインポート `(import "parts/header.lisp")`
- [ ] サーバー・クライアント間のコード共有
- [ ] WebSocketによるリアルタイム通信
- [ ] データベース統合
- [ ] 認証・セッション管理

## ライセンス

MIT

---

**"Lisp All The Way Down"** - サーバーからクライアントまで、すべてLispで。🎉
