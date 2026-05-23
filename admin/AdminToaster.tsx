"use client";

import { useEffect } from "react";
import { toast, Toaster } from "sonner";

function getButtonText(button: Element | null) {
  return button?.textContent?.trim() || "Saved";
}

export default function AdminToaster() {
  useEffect(() => {
    function handleSubmit(event: SubmitEvent) {
      const form = event.target;

      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      const submitter = event.submitter;
      const label = getButtonText(submitter);
      const toastId = toast.loading(`${label}...`);

      window.setTimeout(() => {
        toast.success(`${label} done`, {
          id: toastId,
        });
      }, 900);
    }

    function handleReset(event: Event) {
      const form = event.target;

      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      toast.info("Cancelled changes");
    }

    document.addEventListener("submit", handleSubmit, true);
    document.addEventListener("reset", handleReset, true);

    return () => {
      document.removeEventListener("submit", handleSubmit, true);
      document.removeEventListener("reset", handleReset, true);
    };
  }, []);

  return <Toaster richColors position="top-right" />;
}
