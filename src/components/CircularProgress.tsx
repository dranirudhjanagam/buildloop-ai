import { motion } from "framer-motion";

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  suffix?: string;
  colorClass?: string;
  ringClass?: string;
  delay?: number;
}

const CircularProgress = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label,
  suffix = "%",
  colorClass = "text-primary",
  ringClass = "stroke-primary",
  delay = 0.3,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="-rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-secondary"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className={ringClass}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ delay, duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-display text-2xl font-bold ${colorClass}`}>
            {value}{suffix}
          </span>
        </div>
      </div>
      {label && <p className="text-xs text-muted-foreground">{label}</p>}
    </div>
  );
};

export default CircularProgress;
