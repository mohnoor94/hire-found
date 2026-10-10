import type { SVGProps } from "react";

export interface IllustrationProps extends SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
}
