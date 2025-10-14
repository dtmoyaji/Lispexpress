const ejs = require('ejs');

// Simple in-memory template registry
const templates = new Map();

function register(name, tpl) {
    templates.set(name, tpl);
}

function render(name, ctx) {
    if (!templates.has(name)) throw new Error(`EJS template not found: ${name}`);
    const tpl = templates.get(name);
    // ctx is a plain object
    return ejs.render(tpl, ctx);
}

module.exports = { register, render };
