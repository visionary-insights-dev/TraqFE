export interface ChartBaseProps {
  className?: string;
}

export type ChartTone = "brand" | "success" | "warning" | "danger";

export interface ProgressRingProps extends ChartBaseProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  tone?: ChartTone;
  label?: string;
}

export interface SparklineProps extends ChartBaseProps {
  values: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
  ariaLabel?: string;
}

export interface MiniBarDatum {
  label: string;
  value: number;
  tone?: ChartTone;
}

export interface MiniBarChartProps extends ChartBaseProps {
  data: MiniBarDatum[];
  height?: number;
  max?: number;
  showValues?: boolean;
}