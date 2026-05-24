import { mkdirSync } from 'fs';
import path from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';

/**
 * WHY WINSTON:
 * - Structured log levels (debug / info / warn / error)
 * - Multiple transports from one logger instance
 * - Daily log rotation keeps the logs/ folder from growing unbounded
 * - Errors include stack traces automatically via the `errors()` format
 *
 * WHAT IS LOGGED (per requirements):
 *   ✅  Test suite start / end         (globalSetup / globalTeardown)
 *   ✅  Test start / end               (auto-fixture in fixtures/index.ts)
 *   ✅  Pass / fail + duration         (auto-fixture in fixtures/index.ts)
 *   ✅  Login success / failure        (test files)
 *   ✅  Errors with stack traces       (auto-fixture on failure)
 *
 *   ❌  Every click / locator / navigation  (intentionally omitted)
 */

// Ensure all log directories exist before Winston tries to write
const LOG_DIRS = [
  path.join('logs', 'execution'),
  path.join('logs', 'errors'),
  path.join('logs', 'audit'),
];
LOG_DIRS.forEach((dir) => mkdirSync(dir, { recursive: true }));

// ─── Shared log format ────────────────────────────────────────────────────────
const { combine, timestamp, printf, colorize, errors } = winston.format;

// ANSI escape codes appear in Playwright error messages (colour-formatted
// assertion output). Strip them so log files are clean plain text.
const ANSI_RE = /\x1b\[[0-9;]*m/g;
const stripAnsi = winston.format((info) => {
  if (typeof info.message === 'string') info.message = info.message.replace(ANSI_RE, '');
  if (typeof info.stack === 'string') info.stack = info.stack.replace(ANSI_RE, '');
  return info;
});

const lineFormat = printf(({ level, message, timestamp: ts, stack }) => {
  // Append stack trace on the next line when present (error objects)
  return stack ? `${ts} [${level}] ${message}\n${stack}` : `${ts} [${level}] ${message}`;
});

const fileFormat = combine(
  stripAnsi(),                               // clean files — no ANSI codes
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),                   // capture Error.stack automatically
  lineFormat,
);

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  lineFormat,
);

// ─── Logger instance ─────────────────────────────────────────────────────────
export const logger = winston.createLogger({
  // LOG_LEVEL env var is optional; defaults to 'info'
  level: process.env.LOG_LEVEL ?? 'info',

  transports: [
    // Console — colour output for local development
    new winston.transports.Console({ format: consoleFormat }),

    // execution.log — all info+ events, rotated daily, kept 14 days
    new winston.transports.DailyRotateFile({
      filename: path.join('logs', 'execution', 'execution-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      level: 'info',
      format: fileFormat,
    }),

    // error.log — error-level only, kept 30 days for post-mortems
    new winston.transports.DailyRotateFile({
      filename: path.join('logs', 'errors', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      level: 'error',
      format: fileFormat,
    }),

    // audit.log — same as execution but retained 90 days for compliance
    new winston.transports.DailyRotateFile({
      filename: path.join('logs', 'audit', 'audit-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '90d',
      level: 'info',
      format: fileFormat,
    }),
  ],
});
