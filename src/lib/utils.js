import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Joins class names and resolves Tailwind conflicts: cn("p-2", "p-4") -> "p-4".
// Every shadcn component uses this.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
