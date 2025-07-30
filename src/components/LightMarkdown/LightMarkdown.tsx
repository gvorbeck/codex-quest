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

    // Helper function to escape HTML in user content
    const escapeHtml = (str: string) => {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      // Removed quote and apostrophe escaping - let the browser handle them naturally
    };

    // Process markdown without escaping HTML first, then selectively escape content
    let result = text;

    // Links: [text](url) - process first to avoid conflicts
    result = result.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (match, linkText, url) => {
        // Basic URL validation - only allow http/https
        if (url.match(/^https?:\/\//)) {
          const escapedUrl = escapeHtml(url);
          const escapedText = escapeHtml(linkText);
          return `<a href="${escapedUrl}" target="_blank" rel="noopener noreferrer">${escapedText}</a>`;
        }
        return escapeHtml(match); // Return escaped original if URL is not valid
      },
    );

    // Bold text: **text** or __text__
    result = result.replace(/\*\*(.*?)\*\*/g, (_, content) => {
      return `<strong>${escapeHtml(content)}</strong>`;
    });
    result = result.replace(/__(.*?)__/g, (_, content) => {
      return `<strong>${escapeHtml(content)}</strong>`;
    });

    // Italic text: *text* or _text_
    result = result.replace(/\*(.*?)\*/g, (_, content) => {
      return `<em>${escapeHtml(content)}</em>`;
    });
    result = result.replace(/_(.*?)_/g, (_, content) => {
      return `<em>${escapeHtml(content)}</em>`;
    });

    // Simple lists: - item
    result = result.replace(/^- (.+)$/gm, (_, item) => {
      return `<li>${escapeHtml(item)}</li>`;
    });
    result = result.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

    // Line breaks
    result = result.replace(/\n/g, "<br />");

    // Escape any remaining unprocessed text that's not inside HTML tags
    const parts = result.split(/(<[^>]*>)/);
    result = parts
      .map((part) => {
        // If this part is an HTML tag (starts with <), don't escape it
        if (part.startsWith("<") && part.endsWith(">")) {
          return part;
        }
        // Otherwise, escape any remaining HTML entities (but not quotes or apostrophes)
        return part.replace(/[<>&]/g, (char) => {
          switch (char) {
            case "<":
              return "&lt;";
            case ">":
              return "&gt;";
            case "&":
              return "&amp;";
            default:
              return char;
          }
        });
      })
      .join("");

    return sanitizeHtml(result);
  };

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(children) }}
    />
  );
};

export default LightMarkdown;
