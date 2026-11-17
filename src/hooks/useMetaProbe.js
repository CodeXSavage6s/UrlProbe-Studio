import { useCallback, useEffect, useRef, useState } from "react";
import { probeUrl } from "@/services/metaprobe";
import { groupMetadata } from "@/utils/metadata";

const IDLE = { status: "idle", url: null, raw: null, groups: null, error: null };

// Owns everything about one MetaProbe request: loading, success, error.
// The page just reads `status` and renders the matching UI.
export function useMetaProbe() {
  const [state, setState] = useState(IDLE);
  const controllerRef = useRef(null);

  // Resolves true (success), false (error) or undefined (cancelled by a newer request).
  const run = useCallback(async (url) => {
    controllerRef.current?.abort(); // a newer request replaces any running one
    const controller = new AbortController();
    controllerRef.current = controller;
    setState({ ...IDLE, status: "loading", url });

    try {
      const raw = await probeUrl(url, { signal: controller.signal });
      const groups = groupMetadata(raw);
      setState({ status: "success", url, raw, groups, error: null });
      return true;
    } catch (error) {
      if (error.name === "AbortError") return undefined;
      setState({
        ...IDLE,
        status: "error",
        url,
        error: {
          message: error.message || "Something went wrong.",
          kind: error.kind ?? "unknown",
          status: error.status,
        },
      });
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setState(IDLE);
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { ...state, run, reset };
}
