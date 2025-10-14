// S-expression → EJS トランスレータ
// Lisp形式のテンプレート構文をEJS文字列に変換

/**
 * LIPS Pair/リストをJS配列に変換
 */
function pairToArray(pair) {
    if (!pair) return [];

    // 既に配列の場合
    if (Array.isArray(pair)) {
        return pair;
    }

    // LIPSのPair/リスト構造を配列に変換
    const result = [];
    let current = pair;

    while (current && current !== null && typeof current === 'object') {
        // nilチェック
        if (current.constructor && current.constructor.name === 'Nil') {
            break;
        }

        // Pairの場合
        if (current.car !== undefined) {
            result.push(current.car);
            current = current.cdr;
        } else {
            // 配列やその他
            break;
        }
    }

    return result;
}

/**
 * S-expression形式のテンプレートをEJS文字列に変換
 * 
 * サポートする構文:
 * - (html ...) → <html>...</html>
 * - (tag attrs ...) → <tag attrs>...</tag>
 * - (@ key val ...) → 属性リスト (key="val" ...)
 * - ($ expr) → <%= expr %> (エスケープあり)
 * - ($raw expr) → <%- expr %> (エスケープなし)
 * - (if cond then else) → <% if (cond) { %>then<% } else { %>else<% } %>
 * - (for var in arr body) → <% for (var of arr) { %>body<% } %>
 * - "文字列" → そのまま出力
 * 
 * @param {Array|String} sexp - S-expression (LIPS パース済み配列 or 文字列)
 * @returns {String} EJS テンプレート文字列
 */
function sexpToEjs(sexp) {
    // 文字列はそのまま返す
    if (typeof sexp === 'string') {
        return sexp;
    }

    // LIPSのLStringオブジェクト対応
    if (sexp && typeof sexp.valueOf === 'function' && typeof sexp.valueOf() === 'string') {
        return sexp.valueOf();
    }

    // LIPSのPair/リストを配列に変換
    const arr = pairToArray(sexp);

    // 配列でない、または空の場合
    if (!Array.isArray(arr) || arr.length === 0) {
        return '';
    }

    const [head, ...rest] = arr;

    // headから文字列を取得
    let headStr = '';
    if (typeof head === 'string') {
        headStr = head;
    } else if (head && typeof head.valueOf === 'function') {
        headStr = head.valueOf();
    } else if (head && head.__name__) {
        headStr = head.__name__;
    } else {
        headStr = String(head);
    }

    // 特殊フォーム処理
    switch (headStr) {
        case '$': // エスケープあり出力
            if (rest.length === 0) return '';
            // 値を文字列として取得
            let exprVal = rest[0];
            if (exprVal && typeof exprVal.valueOf === 'function') {
                exprVal = exprVal.valueOf();
            }
            // 文字列リテラルの場合は直接HTMLエスケープして出力
            if (typeof exprVal === 'string') {
                return exprVal.replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            }
            return `<%= ${exprVal} %>`;

        case '$raw': // エスケープなし出力
            if (rest.length === 0) return '';
            // 値を文字列として取得
            let rawVal = rest[0];
            if (rawVal && typeof rawVal.valueOf === 'function') {
                rawVal = rawVal.valueOf();
            }
            // 文字列リテラルの場合は直接出力（エスケープなし）
            if (typeof rawVal === 'string') {
                return rawVal;
            }
            return `<%- ${rawVal} %>`;

        case 'if': { // 条件分岐
            const [cond, thenBranch, elseBranch] = rest;
            let result = `<% if (${cond}) { %>${sexpToEjs(thenBranch)}`;
            if (elseBranch !== undefined) {
                result += `<% } else { %>${sexpToEjs(elseBranch)}`;
            }
            result += '<% } %>';
            return result;
        }

        case 'for': { // ループ
            // (for varname in array body...)
            if (rest.length < 3) return '';
            const varName = typeof rest[0] === 'string' ? rest[0] :
                (rest[0] && rest[0].valueOf) ? rest[0].valueOf() : String(rest[0]);
            const arr = typeof rest[2] === 'string' ? rest[2] :
                (rest[2] && rest[2].valueOf) ? rest[2].valueOf() : String(rest[2]);
            const body = rest.slice(3);
            const bodyEjs = body.map(b => sexpToEjs(b)).join('');
            return `<% for (const ${varName} of ${arr}) { %>${bodyEjs}<% } %>`;
        }

        case '@': { // 属性リスト (@ "class" "foo" "id" "bar") → class="foo" id="bar"
            const attrs = [];
            for (let i = 0; i < rest.length; i += 2) {
                if (i + 1 < rest.length) {
                    const key = sexpToEjs(rest[i]);
                    const val = sexpToEjs(rest[i + 1]);
                    attrs.push(`${key}="${val}"`);
                }
            }
            return attrs.join(' ');
        }

        default: {
            // HTML タグとして扱う: (tagname attrs-or-children...)
            const tagName = headStr;
            let attrs = '';
            let childrenStart = 0;

            // 最初の要素が @ で始まる属性リストか確認
            if (rest.length > 0) {
                const firstArr = pairToArray(rest[0]);
                if (firstArr.length > 0) {
                    const firstHead = firstArr[0];
                    let firstHeadStr = '';
                    if (typeof firstHead === 'string') {
                        firstHeadStr = firstHead;
                    } else if (firstHead && typeof firstHead.valueOf === 'function') {
                        firstHeadStr = firstHead.valueOf();
                    } else if (firstHead && firstHead.__name__) {
                        firstHeadStr = firstHead.__name__;
                    }

                    if (firstHeadStr === '@') {
                        attrs = ' ' + sexpToEjs(rest[0]);
                        childrenStart = 1;
                    }
                }
            }

            // 子要素を再帰処理
            const children = rest.slice(childrenStart).map(child => sexpToEjs(child)).join('');

            // 自己閉じタグを許可するHTML要素（void elements）
            const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 
                                  'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
            
            // 子要素なしでvoid elementの場合のみ自己閉じ
            if (!children && voidElements.includes(tagName.toLowerCase())) {
                return `<${tagName}${attrs} />`;
            }

            // scriptタグなど、子要素がなくても閉じタグが必要
            return `<${tagName}${attrs}>${children}</${tagName}>`;
        }
    }
}

module.exports = { sexpToEjs };
