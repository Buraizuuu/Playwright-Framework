/**
 * Core HTTP client for API testing.
 *
 * WHAT THIS FILE DOES:
 *   Wraps Playwright's APIRequestContext with three additions:
 *   1. Builds the full URL from config.apiBaseUrl + endpoint.
 *   2. Sends Content-Type: application/json on every request.
 *   3. Logs every request/response; stores context for failure reporting.
 *
 * LOGGING LEVELS:
 *   info  — request line + status + duration (always visible)
 *   debug — full URL, headers, payload, response body
 *           Set LOG_LEVEL=debug in .env.qa to see these during troubleshooting.
 */

import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Logger } from 'winston';
import { config } from '../../configs/env';

/** Shape stored after every request — read by the apiClient fixture and failure reporter. */
export interface RequestContext {
  endpoint:     string;
  method:       string;
  payload?:     unknown;
  status:       number;
  responseBody: unknown;
  durationMs:   number;
}

export class ApiClient {
  private _lastContext: RequestContext | null = null;

  constructor(
    private readonly request: APIRequestContext,
    private readonly log:     Logger,
  ) {}

  get lastContext(): RequestContext | null {
    return this._lastContext;
  }

  async get(endpoint: string): Promise<APIResponse> {
    return this._send('GET', endpoint);
  }

  async post(endpoint: string, payload: unknown): Promise<APIResponse> {
    return this._send('POST', endpoint, payload);
  }

  async put(endpoint: string, payload: unknown): Promise<APIResponse> {
    return this._send('PUT', endpoint, payload);
  }

  async delete(endpoint: string): Promise<APIResponse> {
    return this._send('DELETE', endpoint);
  }

  // ── Private ─────────────────────────────────────────────────────────────

  private _fullUrl(endpoint: string): string {
    return `${config.apiBaseUrl.replace(/\/$/, '')}${endpoint}`;
  }

  private _headers(): Record<string, string> {
    return { 'Content-Type': 'application/json' };
  }

  private async _send(
    method:   string,
    endpoint: string,
    payload?: unknown,
  ): Promise<APIResponse> {
    const url     = this._fullUrl(endpoint);
    const headers = this._headers();
    const start   = Date.now();

    // ── Info logs (always visible) ─────────────────────────────────────────
    this.log.info(`REQUEST  : ${method} ${endpoint}`);

    // ── Debug logs (visible when LOG_LEVEL=debug) ──────────────────────────
    this.log.debug(`FULL URL : ${url}`);
    this.log.debug(`HEADERS  : ${JSON.stringify(headers)}`);

    if (payload !== undefined) {
      this.log.debug(`PAYLOAD  : ${JSON.stringify(payload)}`);
    }

    // ── Dispatch ───────────────────────────────────────────────────────────
    // GET and DELETE carry headers only; POST and PUT carry headers + body.
    const baseOpts = { headers };
    const dataOpts = { headers, data: payload };

    let response: APIResponse;

    switch (method) {
      case 'GET':    response = await this.request.get(url,    baseOpts); break;
      case 'POST':   response = await this.request.post(url,   dataOpts); break;
      case 'PUT':    response = await this.request.put(url,    dataOpts); break;
      case 'DELETE': response = await this.request.delete(url, baseOpts); break;
      default:       throw new Error(`Unsupported HTTP method: ${method}`);
    }

    const durationMs = Date.now() - start;

    // ── Capture response body ──────────────────────────────────────────────
    // Playwright buffers the body internally — safe to call .json() here and
    // again in the test without consuming it twice.
    let responseBody: unknown;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = await response.text().catch(() => '');
    }

    // ── Info + debug response logs ─────────────────────────────────────────
    this.log.info(`RESPONSE : ${response.status()} | ${durationMs}ms`);
    this.log.debug(`RESP BODY: ${JSON.stringify(responseBody)}`);

    this._lastContext = { endpoint, method, payload, status: response.status(), responseBody, durationMs };

    return response;
  }
}
