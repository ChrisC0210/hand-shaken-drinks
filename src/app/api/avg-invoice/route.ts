import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

type AvgItem = { region: string; avgInvoice: number };

export async function GET() {
  const { data, error } = await supabase
    // .from("v_avg_invoice_city_latest")
    .from("v_avg_invoice_city_latest")
    .select("city, avg_invoice")
    .order("avg_invoice", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const result: AvgItem[] = (data ?? []).map((r: any) => ({
    region: r.city,
    avgInvoice: Number(r.avg_invoice ?? 0),
  }));

  return NextResponse.json(result);
}