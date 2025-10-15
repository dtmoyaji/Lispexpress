#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);


let lips;
try {
    lips = require('lips');
} catch (e) {
    console.error('LIPS is not installed. Run `npm install` in this directory to install dependencies.');
    process.exit(1);
}

// ext.jsでLIPS拡張を登録
try {
    require('./ext.js')(lips);
} catch (e) {
    console.warn('bin/ext.js のロードに失敗しました:', e.message);
}

if (args.length === 0) {
    // Start a minimal LIPS REPL using lips.exec()
    const readline = require('readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'lips> '
    });

    let buffer = '';
    const promptMain = 'lips> ';
    const promptCont = '... ';

    rl.prompt();

    rl.on('line', async (line) => {
        buffer += line + '\n';
        try {
            // Check if input forms a complete S-expression list
            const complete = (typeof lips.balanced_parenthesis === 'function')
                ? lips.balanced_parenthesis(buffer)
                : true;

            if (complete) {
                // Evaluate
                try {
                    const result = await lips.exec(buffer);
                    if (result && result.value !== undefined) {
                        console.log(result.value);
                    }
                } catch (err) {
                    console.error('LIPS error:', err);
                }
                buffer = '';
                rl.setPrompt(promptMain);
            } else {
                rl.setPrompt(promptCont);
            }
        } catch (err) {
            console.error(err);
            buffer = '';
            rl.setPrompt(promptMain);
        }
        rl.prompt();
    }).on('close', () => {
        process.exit(0);
    });
} else {
    // Evaluate file
    const file = args[0];
    const code = fs.readFileSync(path.resolve(file), 'utf8');
    lips.exec(code)
        .then(result => {
            if (result && result.value !== undefined) {
                console.log(result.value);
            }
            // サーバー起動などの長時間実行が必要な場合、プロセスを維持
            // (Node.jsはイベントループがある限り自動的に実行を継続)
        })
        .catch(err => {
            console.error('LIPS error:', err);
            process.exit(1);
        });
}
