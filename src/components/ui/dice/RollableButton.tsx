import { SIZE_STYLES } from "@/constants/designTokens";

interface RollableButtonProps {
  label: string;
  value: string | number;
  onClick: () => void;
  tooltip: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function RollableButton({
  label,
  value,
  onClick,
  tooltip,
  size = "md",
  className = "",
}: RollableButtonProps) {
  const currentSize = SIZE_STYLES[size];

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between py-3 px-4 gap-4
        rounded-lg
        bg-zinc-750/20 border border-zinc-600/60
        transition-all duration-200
        hover:bg-zinc-700/30 hover:border-amber-400/20
        hover:shadow-lg hover:shadow-amber-400/5
        cursor-pointer group/item
        ${className}
      `}
      title={tooltip}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full group-hover/item:bg-amber-400 transition-colors duration-200"></div>
        <span
          className={`text-amber-400 ${currentSize.labelText} group-hover/item:text-amber-300 transition-colors`}
        >
          {label}
        </span>
      </div>
      <div
        className={`text-zinc-100 ${currentSize.contentText} text-right group-hover/item:text-amber-300 transition-colors`}
      >
        {value}
      </div>
    </button>
  );
}