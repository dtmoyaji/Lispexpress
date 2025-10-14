;; ブラウザLispデモページのテンプレート定義

;; インラインCSSスタイル
(define demo-styles "
.lisp-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}
.code-editor, .output {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  font-family: 'Courier New', monospace;
  min-height: 200px;
}
.code-editor textarea {
  width: 100%;
  height: 200px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  border: none;
  background: white;
  padding: 10px;
  border-radius: 4px;
}
.output {
  white-space: pre-wrap;
  overflow-x: auto;
}
button {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: background 0.3s ease;
}
button:hover {
  background: #5568d3;
}
.example-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 10px 0;
}
.example-buttons button {
  background: #764ba2;
  font-size: 14px;
  padding: 8px 16px;
}
.example-buttons button:hover {
  background: #5a3779;
}
")

;; JavaScriptコード（LIPSの初期化とサンプル）
(define demo-script "
// LIPS環境の初期化
const { exec, env } = lips;

// ブラウザAPIをLIPSから使えるように
env.set('console.log', (...args) => {
  console.log(...args);
  return args.length === 1 ? args[0] : args;
});

env.set('alert', (msg) => {
  alert(msg);
  return msg;
});

env.set('document.getElementById', (id) => {
  return document.getElementById(id);
});

env.set('element.innerHTML!', (elem, html) => {
  elem.innerHTML = html;
  return html;
});

// サンプルコード
const examples = {
  hello: `;; Hello World
(console.log \"Hello from LIPS!\")
(console.log \"LIPS version:\" lips.version)
\"Welcome to browser Lisp! 🎉\"`,

  math: `;; 数値計算の例
;; range関数を定義（1からnまでのリスト生成）
(define (range start end)
  (if (>= start end)
      '()
      (cons start (range (+ start 1) end))))

(define (factorial n)
  (if (<= n 1)
      1
      (* n (factorial (- n 1)))))

(define (fibonacci n)
  (if (< n 2)
      n
      (+ (fibonacci (- n 1))
         (fibonacci (- n 2)))))

(list
  (cons \"5の階乗:\" (factorial 5))
  (cons \"10番目のフィボナッチ数:\" (fibonacci 10))
  (cons \"1から10の合計:\" (apply + (range 1 11))))`,

  list: `;; リスト操作の例
;; range関数を定義
(define (range start end)
  (if (>= start end)
      '()
      (cons start (range (+ start 1) end))))

(define numbers (range 1 11))

(list
  (cons \"元のリスト:\" numbers)
  (cons \"2倍:\" (map (lambda (x) (* x 2)) numbers))
  (cons \"偶数のみ:\" (filter even? numbers))
  (cons \"合計:\" (reduce + 0 numbers)))`,

  dom: `;; DOM操作の例
;; 結果エリアに直接HTMLを書き込み
(define output (document.getElementById \"output\"))
(element.innerHTML! output 
  \"<h4>DOM操作成功！</h4><p>LispからHTMLを生成しました</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>\")
\"DOM操作完了！\"`,

  template: `;; HTMLテンプレート生成
;; concat または + で文字列結合
(define (html-tag tag attrs content)
  (concat 
    \"<\" tag 
    (if attrs (concat \" \" attrs) \"\")
    \">\" 
    content 
    \"</\" tag \">\"))

(define (card title text)
  (html-tag \"div\" \"class='card' style='border:2px solid #667eea;padding:15px;margin:10px 0;border-radius:8px'\"
    (concat
      (html-tag \"h3\" \"style='color:#667eea;margin:0 0 10px 0'\" title)
      (html-tag \"p\" \"style='margin:0'\" text))))

;; 複数のカードを生成
(define cards
  (concat
    (card \"カード1\" \"Lispで生成されたHTMLカードです\")
    (card \"カード2\" \"S-expressionからHTMLへ変換\")
    (card \"カード3\" \"関数型プログラミングの力！\")))

;; 結果を表示
(define output (document.getElementById \"output\"))
(element.innerHTML! output cards)
\"テンプレート生成完了！\"`
};

function loadExample(name) {
  document.getElementById('lisp-code').value = examples[name];
}

async function evalLisp() {
  const code = document.getElementById('lisp-code').value;
  const output = document.getElementById('output');
  
  try {
    output.textContent = '実行中...';
    const result = await exec(code);
    output.textContent = `;; 実行結果:\\n${result}`;
  } catch (error) {
    output.textContent = `;; エラー:\\n${error.message}\\n\\n${error.stack || ''}`;
    output.style.color = '#d32f2f';
    setTimeout(() => { output.style.color = ''; }, 3000);
  }
}

// Ctrl+Enter で実行
document.getElementById('lisp-code').addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    evalLisp();
  }
});

// 初回ロード時にHello Worldを表示
console.log('LIPS loaded! Version:', lips.version);
")

;; ページ全体のテンプレート
(sexp:register "browser-lisp-demo"
  `(html (@ "lang" "ja")
     (head
       (meta (@ "charset" "UTF-8"))
       (meta (@ "name" "viewport" "content" "width=device-width, initial-scale=1.0"))
       (title "LIPS in Browser - Client-side Lisp Demo")
       (link (@ "rel" "stylesheet" "href" "/styles.css"))
       (style ($raw ,demo-styles)))
     (body
       (div (@ "class" "container")
         (div (@ "class" "header")
           (h1 "🎨 LIPS in Browser")
           (p "クライアントサイドでLispを実行"))
         
         (div (@ "class" "content")
           (h2 "ブラウザで動くLisp REPLデモ")
           (p "下のエディタにLispコードを書いて実行ボタンを押してください。")
           
           (div (@ "class" "example-buttons")
             (button (@ "onclick" "loadExample('hello')") "Hello World")
             (button (@ "onclick" "loadExample('math')") "数値計算")
             (button (@ "onclick" "loadExample('list')") "リスト操作")
             (button (@ "onclick" "loadExample('dom')") "DOM操作")
             (button (@ "onclick" "loadExample('template')") "HTMLテンプレート"))
           
           (div (@ "class" "lisp-demo")
             (div (@ "class" "code-editor")
               (h3 "Lispコード")
               (textarea (@ "id" "lisp-code") ";; Hello World\n(console.log \"Hello from LIPS in Browser!\")\n(+ 1 2 3 4 5)"))
             
             (div
               (h3 "実行結果")
               (div (@ "class" "output" "id" "output") ";; 実行結果がここに表示されます")))
           
           (button (@ "onclick" "evalLisp()") "実行 (Ctrl+Enter)"))
         
         (div (@ "class" "content")
           (h3 "📚 サンプルコード説明")
           (ul
             (li (strong "Hello World") " - 基本的な出力")
             (li (strong "数値計算") " - 算術演算と関数定義")
             (li (strong "リスト操作") " - map, filter, reduce")
             (li (strong "DOM操作") " - ブラウザAPIをLispから呼び出し")
             (li (strong "HTMLテンプレート") " - S-expressionでHTML生成"))))
       
       (script (@ "src" "https://cdn.jsdelivr.net/npm/@jcubic/lips@1.0.0-beta.20/dist/lips.min.js"))
       (script ($raw ,demo-script)))))

(js:console.log "Browser Lisp demo template registered")
