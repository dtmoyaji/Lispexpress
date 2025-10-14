;; S-expression形式のCSS定義例

;; 色変数定義（CSS変数として展開される）
(css:define-var "primary" "#667eea")
(css:define-var "secondary" "#764ba2")
(css:define-var "text-dark" "#333")
(css:define-var "bg-light" "#f8f9fa")
(css:define-var "white" "white")
(css:define-var "warning-bg" "#fff3cd")
(css:define-var "warning-border" "#ffc107")
(css:define-var "shadow-sm" "0 2px 5px rgba(0,0,0,0.05)")
(css:define-var "shadow-md" "0 2px 10px rgba(0,0,0,0.1)")

;; 基本的なリセットとレイアウト
(css:register "main-styles"
  '(("*" 
     ("box-sizing" "border-box"))
    
    ("body" 
     ("margin" "0")
     ("padding" "0")
     ("font-family" "Arial, sans-serif")
     ("line-height" "1.6")
     ("color" "var(text-dark)"))
    
    (".container" 
     ("max-width" "1200px")
     ("margin" "0 auto")
     ("padding" "20px"))
    
    (".header" 
     ("background" "linear-gradient(135deg, var(primary) 0%, var(secondary) 100%)")
     ("color" "var(white)")
     ("padding" "2rem")
     ("text-align" "center")
     ("box-shadow" "var(shadow-md)"))
    
    (".header h1" 
     ("margin" "0")
     ("font-size" "2.5rem"))
    
    (".content" 
     ("background" "var(white)")
     ("padding" "2rem")
     ("margin" "2rem 0")
     ("border-radius" "8px")
     ("box-shadow" "var(shadow-sm)"))
    
    ("ul" 
     ("list-style" "none")
     ("padding" "0"))
    
    ("li" 
     ("padding" "10px")
     ("margin" "5px 0")
     ("background" "var(bg-light)")
     ("border-left" "4px solid var(primary)")
     ("border-radius" "4px"))
    
    (".admin-panel" 
     ("background" "var(warning-bg)")
     ("border" "1px solid var(warning-border)")
     ("border-radius" "4px")
     ("padding" "1rem")
     ("margin" "1rem 0"))
    
    ("p" 
     ("margin" "1rem 0"))))

;; レスポンシブ対応
(css:register "responsive-styles"
  '(("@media" "screen and (max-width: 768px)"
     (".container" 
      ("padding" "10px"))
     
     (".header h1" 
      ("font-size" "1.8rem"))
     
     (".content" 
      ("padding" "1rem")))))

;; アニメーション
(css:register "animations"
  '(("keyframes" "fadeIn"
     ("from" 
      ("opacity" "0")
      ("transform" "translateY(-20px)"))
     ("to" 
      ("opacity" "1")
      ("transform" "translateY(0)")))
    
    (".header" 
     ("animation" "fadeIn 0.6s ease-out"))))

(js:console.log "CSS registered: main-styles, responsive-styles, animations")
