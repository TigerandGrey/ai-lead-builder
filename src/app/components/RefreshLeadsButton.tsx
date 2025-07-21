"use client";

import { FC } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshLeadsButtonProps } from "@/lib/types";

const RefreshLeadsButton: FC<RefreshLeadsButtonProps> = ({ setSupabaseLeads }) => {
  const handleRefresh = async () => {
    try {
      // Get Leads from DB
      const response = await fetch("/api/leads", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refresh leads");
      }

      const data = await response.json();
      setSupabaseLeads(data);
      toast.success("Lead refreshed successfully!");
    } catch (error) {
      toast.error("Failed to refresh leads");
    }
  };

  return (
    <Button onClick={handleRefresh} className="w-20">
      Refresh
    </Button>
  );
};

export default RefreshLeadsButton;
