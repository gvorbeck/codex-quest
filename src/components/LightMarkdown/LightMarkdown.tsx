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
  const renderMarkdown = (text: string) => {
    if (!text) return "";

    // Handle basic markdown formatting
    return (
      text
        // Bold text: **text** or __text__
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/__(.*?)__/g, "<strong>$1</strong>")
        // Italic text: *text* or _text_
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/_(.*?)_/g, "<em>$1</em>")
        // Line breaks
        .replace(/\n/g, "<br />")
        // Links: [text](url)
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
        )
        // Simple lists: - item
        .replace(/^- (.+)$/gm, "<li>$1</li>")
        .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    );
  };

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(children) }}
    />
  );
};

export default LightMarkdown;
