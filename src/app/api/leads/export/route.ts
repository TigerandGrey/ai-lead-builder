"use server";

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SupabaseLeadType } from "@/lib/types";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.from("generated_leads").select("*").order("created_at", { ascending: false });

    if (error) throw error;
    // Convert to CSV
    const csvContent = convertToCSV(data);

    // Create response with CSV headers
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=leads_export.csv",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch leads, ${error}` }, { status: 500 });
  }
}

function convertToCSV(data: SupabaseLeadType[]) {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const headerRow = headers.join(",") + "\n";

  const rows = data
    .map((row) => {
      return headers
        .map((header) => {
          let value = row[header as keyof SupabaseLeadType];
          // Escape quotes and wrap in quotes if needed
          if (typeof value === "string") {
            value = value.replace(/"/g, '""');
            if (value.includes(",") || value.includes("\n")) {
              return `"${value}"`;
            }
          }
          return value;
        })
        .join(",");
    })
    .join("\n");

  return headerRow + rows;
}
