;; S-expression形式のテンプレート定義例

;; シンプルなHTMLページテンプレート
(sexp:register "hello-page" 
  '(html 
     (head 
       (title "Hello Page"))
     (body 
       (h1 "Welcome!")
       (p "This is a template from S-expression"))))

;; 変数展開を含むテンプレート
(sexp:register "user-page"
  '(html
     (head
       (title ($ "title")))
     (body
       (h1 ($ "username"))
       (p "Email: " ($ "email")))))

;; 条件分岐を含むテンプレート
(sexp:register "conditional-page"
  '(html
     (body
       (if "user.isAdmin"
         (div (@ "class" "admin-panel")
           (h2 "Admin Panel")
           (p "You have admin privileges"))
         (p "Regular user view")))))

;; ループを含むテンプレート
(sexp:register "items-list"
  '(html
     (body
       (h1 "Items")
       (ul
         (for "item" "in" "items"
           (li ($ "item.name") " - " ($ "item.price")))))))

;; 属性付きタグの例（CSSリンク付き）
(sexp:register "styled-page"
  '(html
     (head
       (meta (@ "charset" "UTF-8"))
       (title "Styled Page")
       (link (@ "rel" "stylesheet" "href" "/styles.css")))
     (body (@ "class" "container")
       (div (@ "class" "header")
         (h1 "Styled Header"))
       (div (@ "class" "content")
         (p "This paragraph has a parent with class 'content'")
         (p "CSS is defined in Lisp S-expressions!")))))

;; より洗練されたテンプレート（フルスタイル付き）
(sexp:register "styled-user-page"
  '(html
     (head
       (meta (@ "charset" "UTF-8"))
       (title ($ "title"))
       (link (@ "rel" "stylesheet" "href" "/styles.css")))
     (body
       (div (@ "class" "container")
         (div (@ "class" "header")
           (h1 ($ "username")))
         (div (@ "class" "content")
           (p "Email: " ($ "email"))
           (p "This page is styled with Lisp-defined CSS!"))))))

;; スタイル付きアイテムリスト
(sexp:register "styled-items"
  '(html
     (head
       (meta (@ "charset" "UTF-8"))
       (title "Items List")
       (link (@ "rel" "stylesheet" "href" "/styles.css")))
     (body
       (div (@ "class" "container")
         (div (@ "class" "header")
           (h1 "Items"))
         (div (@ "class" "content")
           (ul
             (for "item" "in" "items"
               (li ($ "item.name") " - " ($ "item.price")))))))))

(js:console.log "Templates registered: hello-page, user-page, conditional-page, items-list, styled-page, styled-user-page, styled-items")
