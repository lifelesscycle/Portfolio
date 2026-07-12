import { useEffect } from "react";

// Best-effort deterrent only — right-click, copy, and the usual DevTools
// shortcuts get blocked, but DevTools is still reachable from the browser's
// own menu (⋮ > More tools > Developer tools), and page source/text is
// always readable outside the browser regardless of any JS running on the
// page. This raises the bar for casual copying/poking; it does not make
// anything secret or truly uncopyable.
export default function useDisableInspect() {
  useEffect(() => {
    const blockContextMenu = (e) => e.preventDefault();
    const blockSelection = (e) => e.preventDefault();
    const blockCopyCutPaste = (e) => e.preventDefault();
    const blockDrag = (e) => e.preventDefault();

    const blockKeys = (e) => {
      const key = e.key;

      // F12
      if (key === "F12") {
        e.preventDefault();
        return;
      }

      // Ctrl/Cmd + Shift + I / J / C  (DevTools panels, console, inspector)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        ["I", "i", "J", "j", "C", "c"].includes(key)
      ) {
        e.preventDefault();
        return;
      }

      // Ctrl/Cmd + U  (view-source:)
      if ((e.ctrlKey || e.metaKey) && (key === "U" || key === "u")) {
        e.preventDefault();
        return;
      }

      // Ctrl/Cmd + S  (save page)
      if ((e.ctrlKey || e.metaKey) && (key === "S" || key === "s")) {
        e.preventDefault();
        return;
      }

      // Ctrl/Cmd + C / X / A / P  (copy, cut, select-all, print)
      if (
        (e.ctrlKey || e.metaKey) &&
        ["C", "c", "X", "x", "A", "a", "P", "p"].includes(key)
      ) {
        e.preventDefault();
        return;
      }
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockKeys);
    document.addEventListener("selectstart", blockSelection);
    document.addEventListener("copy", blockCopyCutPaste);
    document.addEventListener("cut", blockCopyCutPaste);
    document.addEventListener("dragstart", blockDrag);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("selectstart", blockSelection);
      document.removeEventListener("copy", blockCopyCutPaste);
      document.removeEventListener("cut", blockCopyCutPaste);
      document.removeEventListener("dragstart", blockDrag);
    };
  }, []);
}