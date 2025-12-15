"use client";
import { useEffect, useState } from "react";

type CitySummary = {
  city: string;
  avgInvoice?: number | null;
  avgSalesPerShop?: number | null;
  beverageCompanyCount?: number | null;
  beverageSharePercent?: number | null;
};

export default function CitySummaryTable() {
  const [data, setData] = useState<CitySummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/city-summary")
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body?.error ?? r.statusText ?? "Fetch error");
        }
        return r.json();
      })
      .then((json) => {
        if (!mounted) return;
        setData(json);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>載入中…</div>;
  if (error) return <div className="text-red-600">錯誤：{error}</div>;
  if (!data || data.length === 0) return <div>沒有資料</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-left">縣市</th>
            <th className="border px-2 py-1 text-right">平均發票金額</th>
            <th className="border px-2 py-1 text-right">每店平均營業額</th>
            <th className="border px-2 py-1 text-right">飲料公司數</th>
            <th className="border px-2 py-1 text-right">飲料占比 (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.city}>
              <td className="border px-2 py-1">{r.city}</td>
              <td className="border px-2 py-1 text-right">
                {r.avgInvoice == null ? "—" : r.avgInvoice.toFixed(2)}
              </td>
              <td className="border px-2 py-1 text-right">
                {r.avgSalesPerShop == null ? "—" : (r.avgSalesPerShop).toLocaleString()}
              </td>
              <td className="border px-2 py-1 text-right">
                {r.beverageCompanyCount == null ? "—" : r.beverageCompanyCount.toLocaleString()}
              </td>
              <td className="border px-2 py-1 text-right">
                {r.beverageSharePercent == null ? "—" : (r.beverageSharePercent).toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}