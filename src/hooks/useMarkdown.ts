import { marked } from "marked";
import React from "react";

export const useMarkdown = (markdownText: string): string => {
  const [html, setHtml] = React.useState<string>("");

  React.useEffect(() => {
    const parseMarkdown = async () => {
      try {
        const result = marked.parse(markdownText);
        if (typeof result === "string") {
          setHtml(result);
        } else {
          const resolvedResult = await result;
          setHtml(resolvedResult);
        }
      } catch (error) {
        console.error("Error parsing markdown:", error);
        setHtml("");
      }
    };

    parseMarkdown();
  }, [markdownText]);

  return html;
};
