import { memo } from "react";
import type { JSX } from "react";
import { Typography } from "@/components/ui/design-system";

interface MarkdownTextProps {
  content: string;
  className?: string;
  variant?: "body" | "caption" | "description";
}

/**
 * Simple markdown-to-React converter that handles basic markdown syntax
 * without using dangerouslySetInnerHTML for security
 * 
 * Supported markdown features:
 * - **bold text** - converts to <strong> elements
 * - Paragraph breaks (double newlines) - converts to separate <Typography> elements
 * - Tables - converts pipe-delimited tables to HTML tables
 * 
 * @param content - The markdown content to render
 * @param className - Optional CSS classes to apply to the container
 * @param variant - Typography variant to use for paragraphs
 */
export const MarkdownText = memo(({ 
  content, 
  className = "", 
  variant = "body" 
}: MarkdownTextProps) => {
  // Split into blocks (paragraphs, tables, etc.)
  const blocks = content.split(/\n\s*\n/);
  
  // Process inline markdown within text
  const processInlineMarkdown = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let currentIndex = 0;
    
    // Handle **bold** text
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(text.slice(currentIndex, match.index));
      }
      
      // Add bold element
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold text-zinc-200">
          {match[1]}
        </strong>
      );
      
      currentIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex));
    }
    
    return parts.length > 0 ? parts : [text];
  };
  
  // Check if a block is a markdown table
  const isTable = (block: string) => {
    const lines = block.trim().split('\n');
    // Must have at least 2 lines and most lines should contain pipes
    // Allow for some flexibility in case there are non-table lines mixed in
    const linesWithPipes = lines.filter(line => line.includes('|'));
    return lines.length >= 2 && linesWithPipes.length >= Math.ceil(lines.length * 0.7);
  };
  
  // Parse markdown table into table data
  const parseTable = (tableText: string) => {
    const lines = tableText.trim().split('\n').filter(line => line.includes('|'));
    
    // Find the header line (usually the first line with pipes)
    const headerLine = lines[0];
    let dataStartIndex = 1;
    
    if (!headerLine) {
      return { headers: [], rows: [] };
    }
    
    // Skip separator lines (lines with mostly dashes and pipes)
    while (dataStartIndex < lines.length) {
      const line = lines[dataStartIndex];
      if (line && line.match(/^[\s|:-]+$/)) {
        // This is a separator line, skip it
        dataStartIndex++;
      } else {
        break;
      }
    }
    
    const dataLines = lines.slice(dataStartIndex);
    
    // Parse header - handle leading/trailing spaces and pipes
    const headers = headerLine ? headerLine.split('|')
      .map(h => h.trim())
      .filter(h => h.length > 0) : [];
    
    // Parse data rows - handle leading/trailing spaces and pipes
    const rows = dataLines.map(line => 
      line.split('|')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0)
    ).filter(row => row.length > 0); // Remove empty rows
    
    return { headers, rows };
  };
  
  // Render a table component
  const renderTable = (tableData: { headers: string[], rows: string[][] }, index: number) => (
    <div key={`table-${index}`} className="overflow-x-auto my-4">
      <table className="min-w-full border-collapse border border-zinc-600 bg-zinc-800 text-sm">
        <thead>
          <tr className="bg-zinc-700">
            {tableData.headers.map((header, headerIndex) => (
              <th 
                key={headerIndex}
                className="border border-zinc-600 px-3 py-2 text-left font-semibold text-zinc-200"
              >
                {processInlineMarkdown(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-zinc-750">
              {row.map((cell, cellIndex) => (
                <td 
                  key={cellIndex}
                  className="border border-zinc-600 px-3 py-2 text-zinc-300"
                >
                  {processInlineMarkdown(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, index) => {
        if (!block.trim()) return null;
        
        // Check if this block is a table
        if (isTable(block)) {
          const tableData = parseTable(block);
          return renderTable(tableData, index);
        }
        
        // Regular paragraph
        return (
          <Typography
            key={index}
            variant={variant}
            className="text-zinc-300 leading-relaxed"
          >
            {processInlineMarkdown(block)}
          </Typography>
        );
      })}
    </div>
  );
});

MarkdownText.displayName = "MarkdownText";