# LIPS Fullstack Web Framework

**A complete web framework where everything—from server to client—is written in Lisp** 🚀

Using LIPS (Lisp in JavaScript), you can run Lisp code on both Node.js server-side and browser client-side. Write HTML, CSS, and JavaScript all in S-expression format, achieving true fullstack Lisp development.

[日本語版 README はこちら (Japanese README)](./README.ja.md)

## Motivation

### Why Build Web Apps with Lisp?

1. **HTML and Lisp Affinity**: HTML has a tree structure, which makes it a perfect match for Lisp's S-expressions that naturally represent trees. `<div><p>Hello</p></div>` becomes `(div (p "Hello"))`, making it easier to manipulate as code.

2. **Unified Development Language**: Using different languages for backend and frontend increases cognitive load for developers. With LIPS, you can write both server-side and client-side in the same Lisp, providing:
   - Reduced context switching
   - Improved code reusability
   - Lower learning curve
   - Consistent coding style across the stack

3. **Power of S-expressions**: By expressing HTML and CSS as S-expressions, you gain access to macros and metaprogramming capabilities. You can abstract template and style generation as functions, easily creating reusable components.

## Features

### 🖥️ Server-Side (Node.js + LIPS)

- **Express.js Integration**: Define routes and middleware in Lisp
- **S-expression → EJS**: Write HTML templates in Lisp
- **S-expression → CSS**: Write stylesheets in Lisp with CSS variable support
- **Node.js API**: Access any Node.js module via `js:require`

### 🌐 Client-Side (Browser + LIPS)

- **Run Lisp in Browser**: Load LIPS via CDN, execute Lisp on the client-side
- **DOM Manipulation**: Call DOM APIs directly from Lisp
- **Event Handlers**: Write in Lisp
- **Dynamic HTML Generation**: Generate HTML strings from S-expressions

### 🎨 Complete Lisp Ecosystem

```text
Lisp → HTML (EJS)
Lisp → CSS
Lisp → Server Logic (Express)
Lisp → Client Logic (Browser)
```

## Setup

### 1. Install Dependencies

```cmd
npm install
```

Required packages:

- `lips`: Lisp interpreter
- `express`: Web server
- `ejs`: Template engine

### 2. Start Server

```cmd
node bin/run.js lisp/express.lisp
```

Server will start at `http://localhost:3000`.

## Usage

### Start REPL (Interactive Mode)

```cmd
node bin/run.js
```

### Execute Lisp File

```cmd
node bin/run.js <filepath>
```

## Sample Pages

After starting the server, access these URLs:

### 📚 Server-Side Rendering (Lisp-Defined Templates)

- `http://localhost:3000/server` - Simple page
- `http://localhost:3000/user` - Variable interpolation
- `http://localhost:3000/admin` - Conditional rendering
- `http://localhost:3000/items` - List iteration
- `http://localhost:3000/styled` - Styled page
- `http://localhost:3000/styled-user` - Styled user page
- `http://localhost:3000/styled-items` - Styled items list

### 🌐 Client-Side Lisp

- `http://localhost:3000/demo` - **Browser Lisp REPL** (interactive execution environment)
  - Execute Lisp code in the browser
  - Includes samples for DOM manipulation, calculations, and list processing

### 🎨 Stylesheet

- `http://localhost:3000/styles.css` - Lisp-defined CSS

## Code Examples

### 1. Server Definition (Express + Lisp)

`lisp/express.lisp`:

```lisp
(define app (express))

;; Define route
(app.get "/demo" (lambda (req res)
  (define html (ejs:render "browser-lisp-demo" "{}"))
  (res.send html)))

;; Start server
(app.listen 3000 (lambda ()
  (js:console.log "Server running on http://localhost:3000")))
```

### 2. HTML Template Definition (S-expression → EJS)

`lisp/parts/browser-demo.lisp`:

```lisp
(sexp:register "browser-lisp-demo"
  `(html (@ "lang" "en")
     (head
       (meta (@ "charset" "UTF-8"))
       (title "LIPS Demo"))
     (body
       (div (@ "class" "container")
         (h1 "Hello from Lisp!")
         (p "This page is generated from S-expressions")))))
```

#### Supported Syntax

- `(tag ...)` → `<tag>...</tag>`
- `(tag (@ "key" "val") ...)` → `<tag key="val">...</tag>`
- `($ expr)` → `<%= expr %>` (EJS variable interpolation)
- `($raw expr)` → Raw HTML embedding
- `(if cond then else)` → EJS conditional
- `(for var in arr body)` → EJS loop

### 3. CSS Style Definition (S-expression → CSS)

`lisp/styles.lisp`:

```lisp
;; Define CSS variables
(css:define-var "primary" "#667eea")
(css:define-var "secondary" "#764ba2")

;; Define styles
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

#### Supported Syntax

- `("selector" ("prop" "value") ...)` → CSS rule
- `("@media" "query" (...))` → Media query
- `("keyframes" "name" (...))` → Animation
- `var(name)` → CSS variable reference

### 4. Client-Side Lisp (Run in Browser)

```lisp
;; DOM manipulation
(define output (document.getElementById "output"))
(element.innerHTML! output "<h1>Hello from Browser Lisp!</h1>")

;; Function definition
(define (factorial n)
  (if (<= n 1)
      1
      (* n (factorial (- n 1)))))

;; Execute
(console.log "Factorial of 5:" (factorial 5))
```

### 5. Direct Node.js API Usage

```lisp
;; Require fs module
(define fs (js:require "fs"))

;; Read file
(define content (fs.readFileSync "package.json" "utf8"))
(js:console.log content)

;; path module
(define path (js:require "path"))
(define fullpath (path.join __dirname "bin" "run.js"))
```

## Project Structure

```text
lesson1/
├── bin/
│   ├── run.js              # Entry point
│   ├── ext.js              # LIPS extensions (Node.js integration, template features)
│   ├── ejs-wrapper.js      # EJS template registry
│   ├── sexp-to-ejs.js      # S-expression → EJS converter
│   └── sexp-to-css.js      # S-expression → CSS converter
├── lisp/
│   ├── alias.lisp          # Alias definitions
│   ├── define.lisp         # Node.js module imports
│   ├── styles.lisp         # CSS definitions
│   ├── templates.lisp      # HTML template definitions
│   ├── express.lisp        # Express application
│   └── parts/
│       └── browser-demo.lisp  # Browser REPL page
├── public/                 # Static files (reference old index.html)
├── package.json
└── README.md
```

## Architecture

### Data Flow

```text
┌─────────────────────────────────────────────┐
│  Lisp Source Code (.lisp files)             │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  LIPS Interpreter (Node.js)                 │
│  - Parse S-expressions                      │
│  - Evaluate expressions & execute functions │
└─────────────┬───────────────┬───────────────┘
              │               │
      ┌───────▼─────┐  ┌──────▼──────┐
      │ sexp-to-ejs │  │ sexp-to-css │
      │  Converter  │  │  Converter  │
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

### Server-Side vs Client-Side

| Feature | Server-Side (Node.js) | Client-Side (Browser) |
|---------|----------------------|------------------------|
| **Lisp Interpreter** | LIPS (npm package) | LIPS (CDN) |
| **Runtime** | Node.js | Browser JavaScript |
| **API** | Node.js API (`fs`, `path`, etc) | Browser API (`document`, `window`, etc) |
| **Purpose** | Routing, template generation, CSS generation | DOM manipulation, event handling, UI updates |
| **Output** | HTML/CSS strings | Runtime DOM changes |

### Common Features (Available on Both Sides)

- ✅ Lisp basic syntax (define, lambda, if, let, etc)
- ✅ Numeric operations & list manipulation
- ✅ Function definition & higher-order functions
- ✅ Macros (within LIPS capabilities)

## Tech Stack

- **Lisp Interpreter**: [LIPS](https://lips.js.org/) v1.0.0-beta.20
- **Web Server**: Express.js
- **Template Engine**: EJS
- **Runtime**: Node.js (server) + Modern Browser (client)

## Future Enhancements

- [ ] Component system (reusable UI parts)
- [ ] CSS preprocessor features (nesting, mixins)
- [ ] File imports `(import "parts/header.lisp")`
- [ ] Code sharing between server and client
- [ ] WebSocket real-time communication
- [ ] Database integration
- [ ] Authentication & session management

## License

MIT

---

**"Lisp All The Way Down"** - From server to client, everything in Lisp. 🎉
