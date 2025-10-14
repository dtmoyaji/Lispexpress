// S-expression → CSS トランスレータ
// Lisp形式のスタイル定義をCSS文字列に変換

/**
 * LIPS Pair/リストをJS配列に変換
 */
function pairToArray(pair) {
    if (!pair) return [];

    if (Array.isArray(pair)) {
        return pair;
    }

    const result = [];
    let current = pair;

    while (current && current !== null && typeof current === 'object') {
        if (current.constructor && current.constructor.name === 'Nil') {
            break;
        }

        if (current.car !== undefined) {
            result.push(current.car);
            current = current.cdr;
        } else {
            break;
        }
    }

    return result;
}

/**
 * 値を文字列に変換
 */
function valueToString(val, vars) {
    // 文字列やLStringはそのまま
    if (typeof val === 'string') {
        return resolveVarReference(val, vars);
    }
    if (val && typeof val.valueOf === 'function' && typeof val.valueOf() === 'string') {
        return resolveVarReference(val.valueOf(), vars);
    }
    if (val && val.__name__) {
        return resolveVarReference(val.__name__, vars);
    }
    return resolveVarReference(String(val), vars);
}

function resolveVarReference(str, vars) {
    // フォーマット: "var(name)" または "--name" をサポート
    if (!vars || typeof vars.get !== 'function') return str;

    // 文字列全体が var(...) の場合
    const fullVarMatch = str.match(/^var\(([^)]+)\)$/);
    if (fullVarMatch) {
        const key = fullVarMatch[1];
        if (vars.has(key)) return vars.get(key);
        return str;
    }

    // 文字列内に複数の var(...) が含まれる場合（グローバル置換）
    let result = str.replace(/var\(([^)]+)\)/g, (match, key) => {
        if (vars.has(key)) return vars.get(key);
        return match; // 変数が見つからない場合はそのまま
    });

    // --name style（文字列全体）
    const cssVarMatch = result.match(/^--([A-Za-z0-9_-]+)$/);
    if (cssVarMatch) {
        const key = cssVarMatch[1];
        if (vars.has(key)) return vars.get(key);
    }

    return result;
}

/**
 * S-expression形式のCSSをCSS文字列に変換
 * 
 * サポートする構文:
 * - (selector (property value) ...) → selector { property: value; ... }
 * - (@ media-query (selector ...) ...) → @media media-query { selector { ... } }
 * - (keyframes name (from ...) (to ...) ...) → @keyframes name { from { ... } to { ... } }
 * 
 * 例:
 * '(("body" ("margin" "0") ("padding" "0"))
 *   (".header" ("background" "blue") ("color" "white")))
 * 
 * → body { margin: 0; padding: 0; } .header { background: blue; color: white; }
 * 
 * @param {Array} sexp - S-expression (LIPS パース済みリスト)
 * @returns {String} CSS文字列
 */
function sexpToCss(sexp, indent = '', vars) {
    const arr = pairToArray(sexp);

    if (!Array.isArray(arr) || arr.length === 0) {
        return '';
    }

    let css = '';

    for (const item of arr) {
        const itemArr = pairToArray(item);

        if (!Array.isArray(itemArr) || itemArr.length === 0) {
            continue;
        }

        const [head, ...rest] = itemArr;
        const headStr = valueToString(head, vars);

        // @media, @keyframes などの特殊ルール
        if (headStr === '@media' || headStr === '@') {
            // (@media "screen and (max-width: 600px)" (selector ...))
            if (rest.length >= 2) {
                const query = valueToString(rest[0], vars);
                const rules = rest.slice(1);
                css += `${indent}@media ${query} {\n`;
                css += sexpToCss(rules, indent + '  ', vars);
                css += `${indent}}\n`;
            }
        } else if (headStr === '@keyframes' || headStr === 'keyframes') {
            // (keyframes "fadein" (from ("opacity" "0")) (to ("opacity" "1")))
            if (rest.length >= 1) {
                const name = valueToString(rest[0], vars);
                const frames = rest.slice(1);
                css += `${indent}@keyframes ${name} {\n`;
                for (const frame of frames) {
                    const frameArr = pairToArray(frame);
                    if (frameArr.length >= 1) {
                        const frameName = valueToString(frameArr[0], vars);
                        const props = frameArr.slice(1);
                        css += `${indent}  ${frameName} {\n`;
                        css += renderProperties(props, indent + '    ', vars);
                        css += `${indent}  }\n`;
                    }
                }
                css += `${indent}}\n`;
            }
        } else {
            // 通常のセレクタルール
            const selector = headStr;
            css += `${indent}${selector} {\n`;
            css += renderProperties(rest, indent + '  ', vars);
            css += `${indent}}\n`;
        }
    }

    return css;
}

/**
 * プロパティリストをCSS宣言に変換
 * @param {Array} props - [(prop val) (prop val) ...]
 * @param {String} indent - インデント文字列
 */
function renderProperties(props, indent, vars) {
    let css = '';

    for (const prop of props) {
        const propArr = pairToArray(prop);

        if (Array.isArray(propArr) && propArr.length >= 2) {
            const propName = valueToString(propArr[0], vars);
            const propValue = valueToString(propArr[1], vars);
            css += `${indent}${propName}: ${propValue};\n`;
        }
    }

    return css;
}

module.exports = { sexpToCss };
