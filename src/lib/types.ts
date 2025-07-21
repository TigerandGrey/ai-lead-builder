import { Dispatch, SetStateAction } from "react";

export type LeadType = {
  name: string;
  role: string;
  company: string;
  linkedin_url: string;
};

export type statusType = "Draft" | "Sent" | "Approved";

export type GeneratedLeadType = {
  id?: string;
  name: string;
  role: string;
  company: string;
  linkedin_url: string;
  generated_message?: string;
  status: statusType;
  created_id: string;
  updated_id?: string;
  created_at: string;
  updated_at?: string;
};

export type SupabaseLeadType = GeneratedLeadType & {
  id: string;
};

export type RefreshLeadsButtonProps = {
  setSupabaseLeads: (newSupabaseLeads: SupabaseLeadType[]) => void;
};
export type KanbanProps = {
  supabaseLeads: SupabaseLeadType[];
  setSupabaseLeads: Dispatch<SetStateAction<SupabaseLeadType[]>>;
  refreshKey: number;
};

export type ColumnType = {
  id: statusType;
  title: statusType;
};
export type ColumnProps = ColumnType & {
  supabaseLeads: SupabaseLeadType[];
};
export type SupabaseLeadProps = {
  supabaseLead: SupabaseLeadType;
};
