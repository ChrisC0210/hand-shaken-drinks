"use client";
import { useEffect, useState } from "react";

type ShareItem = {
    region: string;
    sharePercent: number;
};

export default function RevenueShare() {
    const [data, setData] = useState<ShareItem[] | null>(null);
    const [meta, setMeta] = useState<{ source?: string; month?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        fetch("/api/revenue-share")
            .then(async (r) => {
                if (!r.ok) throw new Error(r.statusText);
                return r.json();
            })
            .then((json) => {
                if (!mounted) return;
                if (Array.isArray(json)) {
                    setData(json);
                } else if (json && Array.isArray(json.data)) {
                    setData(json.data);
                    setMeta(json.meta ?? null);
                } else {
                    throw new Error("Unexpected response");
                }
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
            <div className="text-sm text-gray-600 mb-2">
                來源：{meta?.source ?? "v_gov_fnb_sales（飲料占餐飲營收比例）"}{meta?.month ? ` · ${meta.month}` : ""}
            </div>
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border px-2 py-1 text-left">縣市</th>
                        <th className="border px-2 py-1 text-right">飲料占餐飲營收比例 (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.region}>
                            <td className="border px-2 py-1">{row.region}</td>
                            <td className="border px-2 py-1 text-right">{row.sharePercent.toFixed(1)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}