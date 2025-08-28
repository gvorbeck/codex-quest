import { Typography } from "@/components/ui/design-system";

interface SafeHTMLProps {
  content: string;
  variant?: "body" | "caption" | "description";
  className?: string;
}

/**
 * SafeHTML component that renders HTML content safely by parsing basic HTML tags
 * and converting them to React components, avoiding dangerouslySetInnerHTML
 */
export default function SafeHTML({ content, variant = "body", className }: SafeHTMLProps) {
  // Parse simple HTML tags and convert to React components
  const parseContent = (text: string) => {
    // Handle <strong> tags
    const parts = text.split(/(<strong>.*?<\/strong>)/g);
    
    return parts.map((part, index) => {
      const strongMatch = part.match(/<strong>(.*?)<\/strong>/);
      if (strongMatch) {
        return <strong key={index}>{strongMatch[1]}</strong>;
      }
      return part;
    });
  };

  return (
    <Typography variant={variant} className={className}>
      {parseContent(content)}
    </Typography>
  );
}