#!/usr/bin/env node
import { handleMcpMessage } from './mcp.js';
let buffer = '';
const emit = (line) => { let response; try {
    response = handleMcpMessage(JSON.parse(line));
}
catch {
    response = { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } };
} if (response)
    process.stdout.write(`${JSON.stringify(response)}\n`); };
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { buffer += chunk; for (;;) {
    const newline = buffer.indexOf('\n');
    if (newline < 0)
        break;
    const line = buffer.slice(0, newline).trim();
    buffer = buffer.slice(newline + 1);
    if (line)
        emit(line);
} });
process.stdin.on('end', () => { const line = buffer.trim(); if (line)
    emit(line); });
