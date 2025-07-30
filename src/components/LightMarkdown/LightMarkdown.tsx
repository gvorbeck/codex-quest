import React from "react";

interface LightMarkdownProps {
  children: string;
  className?: string;
}

/**
 * A lightweight markdown renderer that handles basic formatting
 * Replaces react-markdown for significant bundle size savings
 */
const LightMarkdown: React.FC<LightMarkdownProps> = ({
  children,
  className,
}) => {
  const sanitizeHtml = (html: string) => {
    // Create a temporary div to parse the HTML
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Remove any script tags and event handlers
    const scripts = temp.querySelectorAll("script");
    scripts.forEach((script) => script.remove());

    // Remove any on* event attributes
    const allElements = temp.querySelectorAll("*");
    allElements.forEach((element) => {
      const attributes = Array.from(element.attributes);
      attributes.forEach((attr) => {
        if (attr.name.startsWith("on")) {
          element.removeAttribute(attr.name);
        }
      });
    });

    return temp.innerHTML;
  };

  const renderMarkdown = (text: string) => {
    if (!text) return "";

    // Escape HTML entities first to prevent XSS
    const escapedText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");

    // Handle basic markdown formatting on escaped text
    const renderedHtml = escapedText
      // Bold text: **text** or __text__
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.*?)__/g, "<strong>$1</strong>")
      // Italic text: *text* or _text_
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      // Line breaks
      .replace(/\n/g, "<br />")
      // Links: [text](url) - with additional URL validation
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        // Basic URL validation - only allow http/https
        if (url.match(/^https?:\/\//)) {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        }
        return match; // Return original if URL is not valid
      })
      // Simple lists: - item
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

    return sanitizeHtml(renderedHtml);
  };

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(children) }}
    />
  );
};

export default LightMarkdown;
