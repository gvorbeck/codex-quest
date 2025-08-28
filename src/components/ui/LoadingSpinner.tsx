import Typography from "@/components/ui/design-system/Typography";

interface LoadingSpinnerProps {
  message: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({
  message,
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className="flex items-center justify-center py-4"
      role="status"
      aria-live="polite"
    >
      <div
        className={`animate-spin rounded-full border-b-2 border-amber-400 ${sizeClasses[size]}`}
        aria-hidden="true"
      />
      <span className="ml-3 sr-only">{message}</span>
      <Typography
        variant="bodySmall"
        color="secondary"
        className="ml-3"
        aria-hidden="true"
      >
        {message}
      </Typography>
    </div>
  );
}
