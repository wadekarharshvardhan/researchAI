import zlib from "zlib";

/**
 * Clean and normalize extracted academic paper text.
 *
 * Handles common extraction artifacts:
 * - Hyphenated line breaks (e.g. "experi-\n ment" -> "experiment")
 * - Page numbers (e.g. "Page 3 of 12", standalone numbers)
 * - Excessive newlines and whitespace
 * - Unicode control characters
 * - Preserves structural paragraphs and sentence boundaries
 */
export function cleanExtractedText(rawText: string): string {
  if (!rawText || typeof rawText !== "string") return "";

  let text = rawText;

  // 1. Normalize unicode (compatibility composition)
  text = text.normalize("NFKC");

  // 2. Normalize carriage returns
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 3. Remove non-printable control characters (except tab and newline)
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 4. Merge hyphenated words across linebreaks: e.g. "archi-\n tecture" -> "architecture"
  text = text.replace(/([A-Za-z]{2,})-\n\s*([A-Za-z]{2,})/g, "$1$2");

  // 5. Remove common page number patterns
  text = text.replace(/^[ \t]*(?:Page\s+\d+(?:\s+of\s+\d+)?|\d+\s*\/\s*\d+)[ \t]*$/gim, "");
  text = text.replace(/^[ \t]*---\s*Page\s+\d+\s*---[ \t]*$/gim, "");
  text = text.replace(/^[ \t]*\d+[ \t]*$/gm, ""); // Standalone numbers on their own line

  // 6. Collapse multiple horizontal spaces/tabs to a single space
  text = text.replace(/[^\S\n]+/g, " ");

  // 7. Collapse 3+ newlines to double newline (paragraph break)
  text = text.replace(/\n{3,}/g, "\n\n");

  // 8. Trim each line and outer whitespace
  text = text
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();

  return text;
}

/**
 * Extract text from uncompressed PDF text operators (BT ... ET).
 */
function extractTextFromStreamContent(streamText: string): string {
  const textChunks: string[] = [];

  // Match all BT (Begin Text) ... ET (End Text) blocks
  const btEtRegex = /BT([\s\S]*?)ET/g;
  let blockMatch: RegExpExecArray | null;

  while ((blockMatch = btEtRegex.exec(streamText)) !== null) {
    const block = blockMatch[1];

    // 1. Match TJ array operator: [(text) 20 (more text)] TJ
    const tjArrayRegex = /\[([\s\S]*?)\]\s*TJ/g;
    let tjMatch: RegExpExecArray | null;
    while ((tjMatch = tjArrayRegex.exec(block)) !== null) {
      const inner = tjMatch[1];
      // Extract string literals inside parentheses: (text)
      const strRegex = /\((.*?)\)/g;
      let strMatch: RegExpExecArray | null;
      let combined = "";
      while ((strMatch = strRegex.exec(inner)) !== null) {
        combined += strMatch[1];
      }
      if (combined.trim()) {
        textChunks.push(combined);
      }
    }

    // 2. Match single Tj operator: (text) Tj
    const tjSingleRegex = /\((.*?)\)\s*Tj/g;
    let singleMatch: RegExpExecArray | null;
    while ((singleMatch = tjSingleRegex.exec(block)) !== null) {
      const val = singleMatch[1];
      if (val.trim()) {
        textChunks.push(val);
      }
    }

    // 3. Match ' (move to next line and show text) operator: (text) '
    const apostropheRegex = /\((.*?)\)\s*'/g;
    let apMatch: RegExpExecArray | null;
    while ((apMatch = apostropheRegex.exec(block)) !== null) {
      const val = apMatch[1];
      if (val.trim()) {
        textChunks.push("\n" + val);
      }
    }
  }

  // Handle escape sequences in PDF strings (\n, \r, \t, \\, \(, \))
  return textChunks
    .map((chunk) =>
      chunk
        .replace(/\\([\\()nrtbf])/g, (_, esc) => {
          switch (esc) {
            case "n":
              return "\n";
            case "r":
              return "\r";
            case "t":
              return "\t";
            case "b":
              return "\b";
            case "f":
              return "\f";
            case "(":
              return "(";
            case ")":
              return ")";
            case "\\":
              return "\\";
            default:
              return esc;
          }
        })
        .replace(/\\([0-7]{1,3})/g, (_, oct) =>
          String.fromCharCode(parseInt(oct, 8))
        )
    )
    .join(" ");
}

/**
 * Extract text from a PDF Buffer.
 *
 * Uses Node's built-in zlib to decompress FlateDecode streams and
 * extract text operators without requiring external binary tools.
 */
export function extractTextFromPdfBuffer(buffer: Buffer): string {
  const extractedTextParts: string[] = [];

  try {
    const bufferStr = buffer.toString("binary");
    const streamMarker = "stream";
    const endStreamMarker = "endstream";

    let startIndex = 0;

    while (startIndex < buffer.length) {
      const streamPos = bufferStr.indexOf(streamMarker, startIndex);
      if (streamPos === -1) break;

      // The content starts right after "stream\r\n" or "stream\n"
      let contentStart = streamPos + streamMarker.length;
      if (buffer[contentStart] === 0x0d && buffer[contentStart + 1] === 0x0a) {
        contentStart += 2;
      } else if (buffer[contentStart] === 0x0a) {
        contentStart += 1;
      }

      const endStreamPos = bufferStr.indexOf(endStreamMarker, contentStart);
      if (endStreamPos === -1) break;

      // Extract dictionary before "stream" to check filters
      const dictSearchStart = Math.max(0, streamPos - 400);
      const dictSnippet = bufferStr.substring(dictSearchStart, streamPos);
      const isFlateDecode = dictSnippet.includes("/FlateDecode");

      const streamBuffer = buffer.subarray(contentStart, endStreamPos);

      let decompressed: Buffer | null = null;

      if (isFlateDecode) {
        try {
          decompressed = zlib.inflateSync(streamBuffer);
        } catch {
          try {
            decompressed = zlib.unzipSync(streamBuffer);
          } catch {
            // Stream might be raw or uncompressed fallback
            decompressed = null;
          }
        }
      } else {
        decompressed = streamBuffer;
      }

      if (decompressed && decompressed.length > 0) {
        const streamText = decompressed.toString("latin1");
        if (streamText.includes("BT") && streamText.includes("ET")) {
          const parsed = extractTextFromStreamContent(streamText);
          if (parsed && parsed.trim().length > 0) {
            extractedTextParts.push(parsed);
          }
        }
      }

      startIndex = endStreamPos + endStreamMarker.length;
    }
  } catch (err) {
    console.warn("PDF stream parsing encountered an issue:", err);
  }

  const rawExtracted = extractedTextParts.join("\n\n");
  return cleanExtractedText(rawExtracted);
}

/**
 * Extract and clean text from an HTML response (e.g. publisher web abstracts or open access landing pages).
 */
export function extractTextFromHtml(html: string): string {
  if (!html || typeof html !== "string") return "";

  let cleaned = html;

  // Remove scripts, styles, noscript, and navigation
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  cleaned = cleaned.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "");
  cleaned = cleaned.replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "");
  cleaned = cleaned.replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "");
  cleaned = cleaned.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "");

  // Replace block elements with linebreaks
  cleaned = cleaned.replace(/<\/(p|div|h[1-6]|li|article|section|tr)>/gi, "\n\n");
  cleaned = cleaned.replace(/<br\s*[\/]?>/gi, "\n");

  // Strip remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, " ");

  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");

  return cleanExtractedText(cleaned);
}
