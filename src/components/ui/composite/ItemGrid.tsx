import { Link } from "wouter";
import { Typography, Button } from "@/components/ui";
import { Icon } from "@/components/ui/core/display";
import type { IconName } from "@/components/ui/core/display";
import { SkeletonCard } from "@/components/ui/core/feedback";
import type { ReactNode } from "react";

interface ItemGridProps<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  emptyState: {
    icon: IconName;
    title: string;
    description: string;
    action?: {
      label: string;
      href: string;
    };
  };
  header: {
    title: string;
    icon: IconName;
    count: number;
  };
  renderItem: (item: T) => ReactNode;
  onRetry?: () => void;
}

export function ItemGrid<T extends { id: string }>({
  items,
  loading,
  error,
  emptyState,
  header,
  renderItem,
  onRetry
}: ItemGridProps<T>) {
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <Typography variant="h4" className="flex items-center gap-2">
            <Icon name={header.icon} size="md" className="text-amber-400" />
            {header.title}
          </Typography>
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400" />
            <Typography variant="helper" color="secondary">
              Loading...
            </Typography>
          </div>
        </div>
        
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Show 6 skeleton cards while loading */}
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard 
              key={index} 
              size="lg"
              label={`Loading ${header.title.toLowerCase().replace('your ', '')}...`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Icon name="exclamation-circle" size="xl" className="text-red-400" />
        <Typography variant="body" className="text-red-400 text-center">
          Error loading {header.title.toLowerCase()}: {String(error)}
        </Typography>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={onRetry || (() => window.location.reload())}
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="p-6 rounded-full bg-amber-950/20 border-2 border-amber-600/30">
          <Icon name={emptyState.icon} size="xl" className="text-amber-400" />
        </div>
        <div className="text-center space-y-3">
          <Typography variant="h4" color="primary">
            {emptyState.title}
          </Typography>
          <Typography variant="body" color="secondary">
            {emptyState.description}
          </Typography>
        </div>
        {emptyState.action && (
          <Link href={emptyState.action.href}>
            <Button variant="primary" size="lg" className="mt-4">
              <Icon name="plus" size="sm" className="mr-2" />
              {emptyState.action.label}
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <Typography variant="h4" className="flex items-center gap-2">
          <Icon name={header.icon} size="md" className="text-amber-400" />
          {header.title}
        </Typography>
        <Typography variant="helper" color="secondary" className="sm:text-right">
          {(() => {
            const title = header.title.toLowerCase();
            if (title.startsWith('your ')) {
              const baseTitle = title.replace('your ', '');
              const singularTitle = header.count === 1 ? baseTitle.replace(/s$/, '') : baseTitle;
              return `${header.count} ${singularTitle}`;
            }
            return `${header.count} ${header.count === 1 ? title.replace(/s$/, '') : title}`;
          })()}
        </Typography>
      </div>
      
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(renderItem)}
      </div>
    </div>
  );
}