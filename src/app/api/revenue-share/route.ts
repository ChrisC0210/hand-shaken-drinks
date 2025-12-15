import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

type ShareItem = { region: string; sharePercent: number };

export async function GET() {
  const { data, error } = await supabase
    // .from("v_revenue_share_latest")
    .from("v_gov_fnb_sales")
    .select("city, beverage_share_percent")
    .order("beverage_share_percent", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const result: ShareItem[] = (data ?? []).map((r: any) => ({
    region: r.city,
    sharePercent: Number(r.beverage_share_percent ?? 0),
  }));

  return NextResponse.json(result);
}