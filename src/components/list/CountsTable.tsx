"use client";
import { useEffect, useState } from "react";

type CountItem = {
    region: string;
    shops: number;
};

export default function CountsTable() {
    const [data, setData] = useState<CountItem[] | null>(null);
    const [meta, setMeta] = useState<{ source?: string; month?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        fetch("/api/counts")
            .then(async (r) => {
                if (!r.ok) throw new Error(r.statusText);
                return r.json();
            })
            .then((json) => {
                if (!mounted) return;
                // 支援兩種回傳格式：直接陣列 OR { data: [...], meta: { source, month } }
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
                來源：{meta?.source ?? "beverage_companies（核准設立）"}{meta?.month ? ` · ${meta.month}` : ""}
            </div>
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border px-2 py-1 text-left">縣市</th>
                        <th className="border px-2 py-1 text-right">店家數</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.region}>
                            <td className="border px-2 py-1">{row.region}</td>
                            <td className="border px-2 py-1 text-right">{row.shops.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}