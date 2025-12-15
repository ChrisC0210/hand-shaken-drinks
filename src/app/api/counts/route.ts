import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

type CountItem = { region: string; shops: number };

export async function GET() {
  const { data, error } = await supabase
    // .from("v_beverage_counts_latest")
    .from("beverage_companies")
    .select("city, beverage_company_count")
    .order("beverage_company_count", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const result: CountItem[] = (data ?? []).map((r: any) => ({
    region: r.city,
    shops: Number(r.beverage_company_count ?? 0),
  }));

  return NextResponse.json(result);
}