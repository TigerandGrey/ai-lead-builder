"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const DownloadLeadsButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/leads/export");

      if (!response.ok) {
        throw new Error("Failed to download leads");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create hidden download link
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads_export_${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast("Download failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={isLoading} className="w-20">
      Download
    </Button>
  );
};

export default DownloadLeadsButton;
