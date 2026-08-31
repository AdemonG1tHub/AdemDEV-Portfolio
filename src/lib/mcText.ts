/**
 * Minecraft Bedrock `§` formatting-code parser.
 *
 * Menu text in `src/config/gilded-menus.config.ts` is copied verbatim out of
 * the add-on's TypeScript sources, so it still carries codes like
 * `"§fWarps"` or `"Welcome, §b{player}§r"`. This turns those into spans with
 * the same colours Bedrock renders, which is what makes the live viewer look
 * like the real thing rather than an approximation.
 *
 * Covers the classic §0-§f palette plus the material codes Bedrock added
 * (§g minecoin, §u amethyst, §v resin, ...), because the rank editor in
 * `adminPage.ts` offers all of them.
 */

const COLORS: Record<string, string> = {
  "0": "#000000", // black
  "1": "#0000AA", // dark blue
  "2": "#00AA00", // dark green
  "3": "#00AAAA", // dark aqua
  "4": "#AA0000", // dark red
  "5": "#AA00AA", // dark purple
  "6": "#FFAA00", // gold / light orange
  "7": "#C6C6C6", // grey
  "8": "#555555", // dark grey
  "9": "#5555FF", // blue
  a: "#55FF55", // green
  b: "#55FFFF", // aqua
  c: "#FF5555", // red
  d: "#FF55FF", // light purple
  e: "#FFFF55", // yellow
  f: "#FFFFFF", // white
  g: "#DDD605", // minecoin gold
  h: "#E3D4D1", // quartz
  i: "#CECACA", // iron
  j: "#443A3B", // netherite
  m: "#971607", // redstone
  n: "#B4684D", // copper / dark peach
  p: "#DEB12D", // gold
  q: "#47A036", // emerald
  s: "#2CBAA8", // diamond
  t: "#21497B", // lapis
  u: "#9A5CC6", // amethyst / violet
  v: "#EB7114", // resin / orange
  w: "#3AB3DA", // light blue
};

const FORMATS = new Set(["k", "l", "m", "n", "o", "r"]);

/** `m` and `n` are colours in Bedrock, not strikethrough/underline. */
const COLOR_ONLY = new Set(["m", "n"]);

interface Style {
  color: string | null;
  bold: boolean;
  italic: boolean;
  obfuscated: boolean;
}

export interface McSpan {
  text: string;
  style: Style;
}

function emptyStyle(): Style {
  return { color: null, bold: false, italic: false, obfuscated: false };
}

/** Splits a `§`-formatted string into styled runs. Newlines are preserved. */
export function parseMcText(input: string): McSpan[] {
  const spans: McSpan[] = [];
  let style = emptyStyle();
  let buffer = "";

  const flush = (): void => {
    if (buffer.length === 0) return;
    spans.push({ text: buffer, style: { ...style } });
    buffer = "";
  };

  for (let i = 0; i < input.length; i++) {
    const char = input[i]!;
    if (char !== "\u00a7" || i + 1 >= input.length) {
      buffer += char;
      continue;
    }

    const code = input[i + 1]!.toLowerCase();
    i++;

    if (code === "r") {
      flush();
      style = emptyStyle();
      continue;
    }

    if (FORMATS.has(code) && !COLOR_ONLY.has(code)) {
      flush();
      if (code === "l") style.bold = true;
      if (code === "o") style.italic = true;
      if (code === "k") style.obfuscated = true;
      continue;
    }

    const color = COLORS[code];
    if (color) {
      flush();
      // A colour code resets formatting in Bedrock, matching vanilla behaviour.
      style = { ...emptyStyle(), color };
      continue;
    }

    // Unknown code — keep the literal characters.
    buffer += `\u00a7${input[i]!}`;
  }

  flush();
  return spans;
}

/** Strips every `§` code, e.g. for `title`/`aria-label` attributes. */
export function stripMcCodes(input: string): string {
  return input.replace(/\u00a7./g, "");
}

const OBFUSCATED_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789#@%&$?!";
let obfuscationTimer: number | null = null;
const obfuscatedNodes = new Set<HTMLElement>();

/** One shared 50ms ticker scrambles every `§k` run on the page. */
function ensureObfuscationTicker(): void {
  if (obfuscationTimer !== null) return;
  obfuscationTimer = window.setInterval(() => {
    for (const node of obfuscatedNodes) {
      if (!node.isConnected) {
        obfuscatedNodes.delete(node);
        continue;
      }
      const length = Number(node.dataset["mcLen"] ?? 0);
      let out = "";
      for (let i = 0; i < length; i++) {
        out += OBFUSCATED_CHARS[Math.floor(Math.random() * OBFUSCATED_CHARS.length)];
      }
      node.textContent = out;
    }
  }, 50);
}

/**
 * Renders `§`-formatted text into `target`, replacing its contents.
 * `\n` becomes a `<br>`, so multi-line bodies work like they do in game.
 */
export function renderMcText(target: HTMLElement, input: string): HTMLElement {
  target.replaceChildren();

  for (const span of parseMcText(input)) {
    const lines = span.text.split("\n");
    lines.forEach((line, index) => {
      if (index > 0) target.append(document.createElement("br"));
      if (line.length === 0) return;

      const node = document.createElement("span");
      if (span.style.color) node.style.color = span.style.color;
      if (span.style.bold) node.style.fontWeight = "700";
      if (span.style.italic) node.style.fontStyle = "italic";

      if (span.style.obfuscated) {
        node.dataset["mcLen"] = String(line.length);
        node.textContent = line;
        obfuscatedNodes.add(node);
        ensureObfuscationTicker();
      } else {
        node.textContent = line;
      }
      target.append(node);
    });
  }

  return target;
}

/** Convenience wrapper returning a fresh element containing the rendered text. */
export function mcTextElement(input: string, tag: keyof HTMLElementTagNameMap = "span", className?: string): HTMLElement {
  const node = document.createElement(tag);
  if (className) node.className = className;
  renderMcText(node, input);
  return node;
}
