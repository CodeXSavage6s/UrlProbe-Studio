import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyText } from "@/utils/clipboard";
import { cn } from "@/lib/utils";

// Icon-only by default (one per metadata row). Pass children for a labeled button.
export default function CopyButton({
  value,
  children,
  ariaLabel = "Copy value",
  variant = "ghost",
  size = "icon",
  className,
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleCopy() {
    if (await copyText(value)) {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      aria-label={copied ? "Copied" : ariaLabel}
      className={cn(size === "icon" && "h-7 w-7 text-muted-foreground hover:text-foreground", className)}
    >
      {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
      {children && <span>{copied ? "Copied" : children}</span>}
    </Button>
  );
}
