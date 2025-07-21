"use server";

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Fetch all leads
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.from("generated_leads").select("*").order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch leads, ${error}` }, { status: 500 });
  }
}

// Insert new lead (single)
export async function POST(req: Request) {
  try {
    const lead = await req.json();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.from("generated_leads").insert(lead).select().single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to create lead, ${error}` }, { status: 500 });
  }
}
