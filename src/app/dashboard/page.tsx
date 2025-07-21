"use client";

import { useCallback, useEffect, useState } from "react";
import { SupabaseLeadType } from "@/lib/types";
import { Card } from "@/components/ui/card";

import CreateNewLeadButton from "../components/CreateNewLeadButton";
import RefreshLeadsButton from "../components/RefreshLeadsButton";
import KanbanBoard from "../components/KanbanBoard";
import DownloadLeadsButton from "../components/DownloadLeadsButton";

const Dashboard = () => {
  const [supabaseLeads, setSupabaseLeads] = useState<SupabaseLeadType[]>([]);
  const [refreshKey, setRefreshKey] = useState(0); // Trigger remount Kanban
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leads function
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/leads", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refresh leads");
      }

      const data = await response.json();
      setSupabaseLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load leads on component mount
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Trigger remount Kanban
  const handleRefresh = useCallback((newSupabaseLeads: SupabaseLeadType[]) => {
    setSupabaseLeads(newSupabaseLeads);
    setRefreshKey((prev) => prev + 1);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Card className="w-1/3 flex items-center">Loading leads...</Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <Card className="w-1/3 flex items-center text-red-500">Error: {error}</Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-8">
      <div className="flex justify-start gap-5">
        <CreateNewLeadButton />
        <RefreshLeadsButton setSupabaseLeads={handleRefresh} />
        <DownloadLeadsButton />
      </div>
      {/* <LeadTable data={data} /> */}
      <KanbanBoard
        supabaseLeads={supabaseLeads}
        setSupabaseLeads={setSupabaseLeads}
        refreshKey={refreshKey} // Force remount on refresh
      />
    </div>
  );
};

export default Dashboard;
