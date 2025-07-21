"use server";

import { NextResponse } from "next/server";
import { SupabaseLeadType } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Fetch one lead
const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.from("generated_leads").select("*").eq("id", id).single(); // Use single() to get one record

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch lead with id ${id}: ${error}` }, { status: 500 });
  }
};

// Update one lead
const PUT = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const lead: SupabaseLeadType = await req.json();

  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.from("generated_leads").update(lead).eq("id", id).select();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to update lead with id ${id}, ${error}` }, { status: 500 });
  }
};

// Delete one lead
const DELETE = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from("generated_leads").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Lead deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete lead with id ${id}: ${error}` }, { status: 500 });
  }
};

export { GET, PUT, DELETE };
