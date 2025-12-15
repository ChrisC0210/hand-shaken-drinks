import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });

type CitySummary = {
  city: string;
  avgInvoice?: number | null;
  avgSalesPerShop?: number | null;
  beverageCompanyCount?: number | null;
  beverageSharePercent?: number | null;
};

function pickNumber(v: any) {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

export async function GET() {
  try {
    // 1) 抓三張 view（如果 view 名稱不一樣，改成你的 view）
    const [avgRes, salesRes, countsRes, shareRes] = await Promise.all([
      supabase.from("v_avg_invoice_city_latest").select("city, avg_invoice"),
      supabase.from("v_gov_fnb_sales").select("county_name, avg_restaurant_sales_per_shop, info_month").limit(1000),
      supabase.from("v_beverage_counts_latest").select("city, beverage_company_count"),
      supabase.from("v_revenue_share_latest").select("city, beverage_share_percent"),
    ]);

    if (avgRes.error) throw avgRes.error;
    if (salesRes.error) throw salesRes.error;
    if (countsRes.error) throw countsRes.error;
    if (shareRes.error) throw shareRes.error;

    const map = new Map<string, CitySummary>();

    // avg invoice
    (avgRes.data ?? []).forEach((r: any) => {
      const city = r.city ?? r.county_name ?? r.county ?? "未知";
      map.set(city, {
        ...(map.get(city) ?? { city }),
        avgInvoice: pickNumber(r.avg_invoice ?? r.avg_invoice_latest),
      });
    });

    // avg sales per shop (v_gov_fnb_sales or v_gov_fnb_sales view fields)
    (salesRes.data ?? []).forEach((r: any) => {
      const city = r.county_name ?? r.city ?? "未知";
      const existing = map.get(city) ?? { city };
      // try multiple candidate fields
      const val = r.avg_restaurant_sales_per_shop ?? r.avg_sales_per_restaurant ?? r.avg_restaurant_sales;
      existing.avgSalesPerShop = pickNumber(val);
      map.set(city, existing);
    });

    // counts
    (countsRes.data ?? []).forEach((r: any) => {
      const city = r.city ?? r.county_name ?? "未知";
      const existing = map.get(city) ?? { city };
      existing.beverageCompanyCount = pickNumber(r.beverage_company_count ?? r.count);
      map.set(city, existing);
    });

    // share percent
    (shareRes.data ?? []).forEach((r: any) => {
      const city = r.city ?? r.county_name ?? "未知";
      const existing = map.get(city) ?? { city };
      existing.beverageSharePercent = pickNumber(r.beverage_share_percent ?? r.beverage_share);
      map.set(city, existing);
    });

    // convert to array and sort by avgInvoice desc (調整排序自訂)
    const result = Array.from(map.values()).sort((a, b) => (b.avgInvoice ?? 0) - (a.avgInvoice ?? 0));

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("city-summary error:", err);
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}