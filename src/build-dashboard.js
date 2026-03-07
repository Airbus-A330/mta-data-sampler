/**
 * @file build-dashboard.js
 * @description Builds a standalone HTML dashboard from the generated
 * station-analysis JSON so the dataset can be explored in a browser without a
 * backend.
 */

const fs = require('fs');
const path = require('path');
const logger = require('./lib/logger');

const ROOT_DIR = path.resolve(__dirname, '..');
const INPUT_JSON_PATH = process.env.ANALYSIS_OUTPUT_PATH ?? path.join(ROOT_DIR, 'output', 'station-analysis.json');
const OUTPUT_HTML_PATH = process.env.DASHBOARD_OUTPUT_PATH ?? path.join(ROOT_DIR, 'output', 'dashboard.html');

/**
 * Reads and parses UTF-8 JSON from disk.
 *
 * @param {string} filePath
 * @returns {any}
 */
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Ensures a directory exists before writing a file.
 *
 * @param {string} directoryPath
 */
function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

/**
 * Escapes JSON for safe inline embedding in HTML.
 *
 * @param {any} value
 * @returns {string}
 */
function serializeForHtml(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

/**
 * Builds the standalone HTML dashboard document.
 *
 * @param {any} analysis
 * @returns {string}
 */
function buildHtml(analysis) {
  const embeddedData = serializeForHtml(analysis);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Subliminal Spaces Dashboard</title>
  <style>
    :root {
      --bg: #f4f1ea;
      --bg-accent: radial-gradient(circle at top left, rgba(183, 214, 194, 0.35), transparent 35%), radial-gradient(circle at top right, rgba(236, 211, 186, 0.45), transparent 28%), linear-gradient(180deg, #f7f3ec 0%, #f0ebe4 100%);
      --panel: rgba(255, 252, 247, 0.84);
      --panel-strong: rgba(255, 252, 247, 0.94);
      --border: rgba(74, 68, 57, 0.12);
      --text: #201d18;
      --muted: #666052;
      --accent: #1e6b5c;
      --accent-soft: rgba(30, 107, 92, 0.12);
      --accent-strong: #0f4e42;
      --shadow: 0 18px 48px rgba(52, 46, 36, 0.12);
      --positive: #2b7a4b;
      --negative: #a44d3f;
      --warning: #986b17;
      --chip: rgba(32, 29, 24, 0.06);
      --input: rgba(255, 255, 255, 0.9);
      --table-stripe: rgba(32, 29, 24, 0.03);
    }

    body.dark {
      --bg: #171a1f;
      --bg-accent: radial-gradient(circle at top left, rgba(52, 98, 89, 0.35), transparent 32%), radial-gradient(circle at top right, rgba(102, 75, 44, 0.3), transparent 26%), linear-gradient(180deg, #15181d 0%, #101318 100%);
      --panel: rgba(28, 32, 39, 0.82);
      --panel-strong: rgba(24, 28, 34, 0.96);
      --border: rgba(235, 228, 215, 0.08);
      --text: #efe8da;
      --muted: #b3ab9d;
      --accent: #7bc1af;
      --accent-soft: rgba(123, 193, 175, 0.14);
      --accent-strong: #a5dfd1;
      --shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
      --positive: #91d18d;
      --negative: #f19885;
      --warning: #e2c27a;
      --chip: rgba(255, 255, 255, 0.08);
      --input: rgba(17, 20, 26, 0.86);
      --table-stripe: rgba(255, 255, 255, 0.03);
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; background: var(--bg-accent); color: var(--text); font-family: "Segoe UI", "Aptos", "Helvetica Neue", sans-serif; }
    body { transition: background 220ms ease, color 220ms ease; }
    .shell { max-width: 1500px; margin: 0 auto; padding: 28px; }
    .hero { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(260px, 0.75fr); gap: 18px; margin-bottom: 18px; }
    .panel { background: var(--panel); backdrop-filter: blur(18px); border: 1px solid var(--border); border-radius: 24px; box-shadow: var(--shadow); }
    .hero-copy { padding: 28px; }
    .eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: var(--accent-soft); color: var(--accent-strong); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; }
    h1 { margin: 16px 0 10px; font-size: clamp(2rem, 4vw, 3.6rem); line-height: 1.05; letter-spacing: -0.04em; }
    p { margin: 0; color: var(--muted); line-height: 1.6; }
    .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 20px; }
    .button, .toggle { appearance: none; border: 1px solid var(--border); background: var(--panel-strong); color: var(--text); border-radius: 999px; padding: 11px 16px; cursor: pointer; font: inherit; transition: transform 180ms ease, background 180ms ease, border-color 180ms ease; }
    .button:hover, .toggle:hover { transform: translateY(-1px); }
    .hero-meta { padding: 22px; display: grid; gap: 12px; align-content: start; }
    .stat-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 18px; }
    .stat-card { padding: 18px; }
    .stat-label { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; margin-bottom: 10px; }
    .stat-value { font-size: clamp(1.3rem, 2vw, 2.1rem); font-weight: 700; letter-spacing: -0.04em; }
    .icon-wrap { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 12px; background: var(--accent-soft); color: var(--accent-strong); flex: 0 0 auto; }
    .icon-wrap svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .icon-inline { display: inline-flex; align-items: center; gap: 10px; }
    .layout { display: grid; grid-template-columns: 320px minmax(0, 1fr); gap: 18px; }
    .sidebar { padding: 18px; position: sticky; top: 20px; height: calc(100vh - 40px); overflow: hidden; display: flex; flex-direction: column; }
    .sidebar h2, .content h2 { margin: 0 0 14px; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.08em; }
    .search { width: 100%; border: 1px solid var(--border); background: var(--input); color: var(--text); padding: 12px 14px; border-radius: 14px; font: inherit; outline: none; margin-bottom: 14px; }
    .control-grid { display: grid; gap: 10px; margin-bottom: 14px; }
    .control-select {
      width: 100%;
      border: 1px solid var(--border);
      background: var(--input);
      color: var(--text);
      padding: 11px 12px;
      border-radius: 14px;
      font: inherit;
      outline: none;
    }
    .station-list { overflow: auto; display: grid; gap: 10px; padding-right: 2px; }
    .station-button { width: 100%; text-align: left; border: 1px solid var(--border); background: transparent; color: var(--text); padding: 14px; border-radius: 16px; cursor: pointer; transition: background 160ms ease, border-color 160ms ease, transform 160ms ease; }
    .station-button:hover { transform: translateY(-1px); }
    .station-button.active { background: var(--accent-soft); border-color: rgba(30, 107, 92, 0.35); }
    .station-button strong { display: block; margin-bottom: 6px; font-size: 0.98rem; }
    .station-button small { display: flex; justify-content: space-between; gap: 10px; color: var(--muted); }
    .content { display: grid; gap: 18px; }
