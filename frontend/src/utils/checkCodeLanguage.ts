// npm module highlightjs installed
// docs from https://github.com/highlightjs/highlight.js/tree/main/docs

import hljs from "highlight.js/lib/core";
import c from "highlight.js/lib/languages/c";
import python from "highlight.js/lib/languages/python";
import javascript from "highlight.js/lib/languages/javascript";
import type { CodeLanguage } from "../utils/types";

hljs.registerLanguage("c", c);
hljs.registerLanguage("python", python);
hljs.registerLanguage("javascript", javascript);

function checkCodeLanguage(code: string): CodeLanguage {
  const result = hljs.highlightAuto(code, ["c", "javascript", "python"]);
  const autoDetectedLanguage = result.language;
  if (autoDetectedLanguage === "c") {
    return "c";
  }
  if (autoDetectedLanguage === "python") {
    return "python";
  }
  return "javascript";
}

export default checkCodeLanguage;
