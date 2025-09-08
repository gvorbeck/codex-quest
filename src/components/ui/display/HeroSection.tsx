import type { ReactNode } from "react";
import { Typography } from "@/components/ui/design-system";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  logo?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function HeroSection({ 
  title, 
  subtitle, 
  logo, 
  children, 
  className = "" 
}: HeroSectionProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 rounded-3xl opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-highlight-900/20 via-transparent to-transparent rounded-3xl" />

      {/* Decorative elements */}
      <div className="absolute top-8 left-8 w-32 h-32 bg-highlight-400/10 rounded-full blur-2xl" />
      <div className="absolute bottom-8 right-8 w-40 h-40 bg-highlight-500/5 rounded-full blur-3xl" />

      {/* Content */}
      <header className="relative text-center space-y-8 px-8">
        {logo && (
          <div className="flex justify-center mb-6">
            {logo}
          </div>
        )}

        <div className="space-y-4">
          <Typography
            variant="h1"
            className="text-4xl lg:text-5xl xl:text-6xl font-title text-text-primary drop-shadow-lg"
          >
            {title}
          </Typography>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-highlight-400 to-transparent mx-auto" />
        </div>

        {subtitle && (
          <Typography
            variant="body"
            color="secondary"
            className="text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed text-text-secondary"
          >
            {subtitle}
          </Typography>
        )}

        {children}
      </header>
    </div>
  );
}