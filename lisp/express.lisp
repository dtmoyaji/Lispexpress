
(load "lisp/alias.lisp")
(load "lisp/define.lisp")
(load "lisp/styles.lisp")
(load "lisp/templates.lisp")
(load "lisp/parts/browser-demo.lisp")

(define app (express))
(define path (js:require "path"))

;; 静的ファイル配信（public フォルダ）
(app.use (express.static "public"))

;; ブラウザLispデモページ（Lisp定義のテンプレートから生成）
(app.get "/demo" (lambda (req res)
  (define html (ejs:render "browser-lisp-demo" "{}"))
  (res.send html)))

;; シンプルなテンプレート表示
(app.get "/server" (lambda (req res)
  (define html (ejs:render "hello-page" "{}"))
  (res.send html)))

;; 変数展開テンプレート
(app.get "/user" (lambda (req res)
  (define ctx "{\"title\": \"User Profile\", \"username\": \"Alice\", \"email\": \"alice@example.com\"}")
  (define html (ejs:render "user-page" ctx))
  (res.send html)))

;; 条件分岐テンプレート
(app.get "/admin" (lambda (req res)
  (define ctx "{\"user\": {\"isAdmin\": true}}")
  (define html (ejs:render "conditional-page" ctx))
  (res.send html)))

;; ループテンプレート
(app.get "/items" (lambda (req res)
  (define ctx "{\"items\": [{\"name\": \"Apple\", \"price\": \"$1\"}, {\"name\": \"Banana\", \"price\": \"$0.50\"}]}")
  (define html (ejs:render "items-list" ctx))
  (res.send html)))

;; ルート: ホームページ（主要ルートへのリンク一覧）
(app.get "/" (lambda (req res)
  (define html "<!doctype html>\n<html>\n<head><meta charset=\"utf-8\"><title>Lispexpress</title></head>\n<body>\n<h1>Lispexpress</h1>\n<p>Available routes:</p>\n<ul>\n  <li><a href=\"/server\">/server</a></li>\n  <li><a href=\"/user\">/user</a></li>\n  <li><a href=\"/admin\">/admin</a></li>\n  <li><a href=\"/items\">/items</a></li>\n  <li><a href=\"/styled\">/styled</a></li>\n  <li><a href=\"/styled-user\">/styled-user</a></li>\n  <li><a href=\"/styled-items\">/styled-items</a></li>\n  <li><a href=\"/demo\">/demo (browser LIPS)</a></li>\n  <li><a href=\"/styles.css\">/styles.css</a></li>\n</ul>\n</body>\n</html>")
  (res.send html)))

;; 属性付きテンプレート
(app.get "/styled" (lambda (req res)
  (define html (ejs:render "styled-page" "{}"))
  (res.send html)))

;; CSSファイルの配信（全スタイルを結合）
(app.get "/styles.css" (lambda (req res)
  (define main-css (css:render "main-styles"))
  (define responsive-css (css:render "responsive-styles"))
  (define animations-css (css:render "animations"))
  (define combined (concat main-css "\n" responsive-css "\n" animations-css))
  (res.set "Content-Type" "text/css")
  (res.send combined)))

;; スタイル付きユーザーページ
(app.get "/styled-user" (lambda (req res)
  (define ctx "{\"title\": \"User Profile\", \"username\": \"Alice\", \"email\": \"alice@example.com\"}")
  (define html (ejs:render "styled-user-page" ctx))
  (res.send html)))

;; スタイル付きアイテムリスト
(app.get "/styled-items" (lambda (req res)
  (define ctx "{\"items\": [{\"name\": \"Apple\", \"price\": \"$1.00\"}, {\"name\": \"Banana\", \"price\": \"$0.50\"}, {\"name\": \"Orange\", \"price\": \"$0.75\"}]}")
  (define html (ejs:render "styled-items" ctx))
  (res.send html)))

(define server (app.listen 3000 (lambda ()
  (js:console.log "Server running on http://localhost:3000")
  (js:console.log "")
  (js:console.log "📚 Server-side routes (Lisp templates):")
  (js:console.log "  /server, /user, /admin, /items, /styled, /styled-user, /styled-items")
  (js:console.log "")
  (js:console.log "🌐 Client-side Lisp demo:")
  (js:console.log "  /demo - Browser REPL (LIPS in browser)")
  (js:console.log "")
  (js:console.log "🎨 CSS:")
  (js:console.log "  /styles.css"))))
