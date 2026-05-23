"use client";

import { useEffect } from "react";
import { toast, Toaster } from "sonner";

export default function AdminAccessToast({ denied }: { denied: boolean }) {
  useEffect(() => {
    if (denied) {
      toast.error("You are not the admin");
    }
  }, [denied]);

  return <Toaster richColors position="top-right" />;
}
