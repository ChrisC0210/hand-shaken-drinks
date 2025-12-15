### 1.1 每個縣市最新一個月的平均發票金額（餐飲業）
```sql
-- 取出 ods_invoice_stats 中「餐飲業」最近一個月份，
-- 每個縣市的平均發票金額（使用 avg_invoice_amount 平均）
with latest_month as (
  select max(invoice_month) as m
  from public.ods_invoice_stats
  where industry = '餐飲業'
)
select
  city,
  round(avg(avg_invoice_amount), 2) as avg_invoice_latest
from public.ods_invoice_stats, latest_month
where
  industry = '餐飲業'
  and invoice_month = latest_month.m
group by city
order by avg_invoice_latest desc;
```

### 1.2 各縣市餐飲業「每家店平均月營業額」
#### 「哪個縣市一間餐飲店平均營業額最高」(gov_fnb_sales)
```sql
select
  county_name as city,
  restaurant_shops,
  restaurant_sales,
  case
    when restaurant_shops > 0
      then round(restaurant_sales / restaurant_shops, 0)
    else null
  end as avg_sales_per_restaurant
from public.gov_fnb_sales
order by avg_sales_per_restaurant desc nulls last;

```
#### 用這張表下去查「最新一個月哪個縣市餐飲業每店平均營業額最高」(v_gov_fnb_sales)
```sql
SELECT
  info_month,
  county_id,
  county_name,
  restaurant_shops,
  restaurant_sales,
  avg_restaurant_sales_per_shop
FROM public.v_gov_fnb_sales
WHERE info_month = (SELECT MAX(info_month) FROM public.v_gov_fnb_sales)
  AND restaurant_shops > 0
ORDER BY avg_restaurant_sales_per_shop DESC
LIMIT 1;

```
```sql
-- 如果要刪除某個縣市的資料，可以用下面的語法
--遇到資料格式有錯誤SQL指令無法跑成功，可以用這個方式刪除錯誤資料
BEGIN;

-- 0) 先刪掉「表頭被當資料」那筆垃圾列
DELETE FROM public.gov_fnb_sales
WHERE county_id = '縣市代碼'
   OR county_name = '縣市名稱';

-- 1) 先把「看起來像數字但混有空白/逗號」的 text 清乾淨
--    （如果你的欄位原本就是 numeric，這段 UPDATE 也不會有害）
UPDATE public.gov_fnb_sales
SET
  total_fnb_shops   = NULLIF(REGEXP_REPLACE(TRIM(total_fnb_shops),   '[, ]', '', 'g'), ''),
  lodging_shops     = NULLIF(REGEXP_REPLACE(TRIM(lodging_shops),     '[, ]', '', 'g'), ''),
  restaurant_shops  = NULLIF(REGEXP_REPLACE(TRIM(restaurant_shops),  '[, ]', '', 'g'), ''),
  total_fnb_sales   = NULLIF(REGEXP_REPLACE(TRIM(total_fnb_sales),   '[, ]', '', 'g'), ''),
  lodging_sales     = NULLIF(REGEXP_REPLACE(TRIM(lodging_sales),     '[, ]', '', 'g'), ''),
  restaurant_sales  = NULLIF(REGEXP_REPLACE(TRIM(restaurant_sales),  '[, ]', '', 'g'), ''),
  info_month        = NULLIF(TRIM(info_month), '')
;

-- 2) 把數字欄位轉成 numeric（遇到不能轉的會先被上一步清成 NULL）
--    如果這些欄位目前是 text，這一步就會修好你的 type 問題
ALTER TABLE public.gov_fnb_sales
  ALTER COLUMN total_fnb_shops   TYPE numeric USING NULLIF(total_fnb_shops, '')::numeric,
  ALTER COLUMN lodging_shops     TYPE numeric USING NULLIF(lodging_shops, '')::numeric,
  ALTER COLUMN restaurant_shops  TYPE numeric USING NULLIF(restaurant_shops, '')::numeric,
  ALTER COLUMN total_fnb_sales   TYPE numeric USING NULLIF(total_fnb_sales, '')::numeric,
  ALTER COLUMN lodging_sales     TYPE numeric USING NULLIF(lodging_sales, '')::numeric,
  ALTER COLUMN restaurant_sales  TYPE numeric USING NULLIF(restaurant_sales, '')::numeric;

-- 3) info_month 轉成 date（如果你目前是 date，這句也可保留不動）
--    你的資料像 '2025-06-01' 這種格式 :contentReference[oaicite:2]{index=2}
ALTER TABLE public.gov_fnb_sales
  ALTER COLUMN info_month TYPE date USING info_month::date;

-- 4) 建立 Dashboard 用 view：把每店平均直接算好
DROP VIEW IF EXISTS public.v_gov_fnb_sales;

CREATE VIEW public.v_gov_fnb_sales AS
SELECT
  info_month,
  county_id,
  county_name,

  total_fnb_shops,
  lodging_shops,
  restaurant_shops,

  total_fnb_sales,
  lodging_sales,
  restaurant_sales,

  -- 全餐飲(含住宿) 每店平均月營業額
  (total_fnb_sales / NULLIF(total_fnb_shops, 0)) AS avg_total_sales_per_shop,

  -- 餐飲業(不含住宿) 每店平均月營業額（你要的通常是這個）
  (restaurant_sales / NULLIF(restaurant_shops, 0)) AS avg_restaurant_sales_per_shop

FROM public.gov_fnb_sales
WHERE info_month IS NOT NULL;

COMMIT;
```



### 1.3 各縣市飲料相關公司數量
#### 代表各縣市「飲料店/飲料公司密度」(beverage_companies)
```sql
select
  city,
  count(*) as beverage_company_count
from public.beverage_companies
where status = '核准設立'
group by city
order by beverage_company_count desc;

```

2️⃣ 做一支真的可以用的 /api/avg-invoice 給前端

現在的 AvgInvoiceTable 前端是長這樣（簡化）：
```
type AvgItem = {
  region: string;
  avgInvoice: number;
};

fetch("/api/avg-invoice")
```

讓 API 回傳「region + avgInvoice」，但資料來自 ods_invoice_stats 聚合，而不是手打的表。

2.1 在 Supabase 建一個 View（讓查詢更乾淨）
在 SQL Editor 建一個 view：

create or replace view public.v_avg_invoice_city_latest as
with latest_month as (
  select max(invoice_month) as m
  from public.ods_invoice_stats
  where industry = '餐飲業'
)
select
  city,
  round(avg(avg_invoice_amount), 2) as avg_invoice
from public.ods_invoice_stats, latest_month
where
  industry = '餐飲業'
  and invoice_month = latest_month.m
group by city;


這樣你以後只要 select * from v_avg_invoice_city_latest 就好。

2.2 App Router 版：app/api/avg-invoice/route.ts
```
// app/api/avg-invoice/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

type AvgItem = {
  region: string;
  avgInvoice: number;
};

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("v_avg_invoice_city_latest") // ← 用剛才的 View
      .select("city, avg_invoice")
      .order("avg_invoice", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const result: AvgItem[] =
      data?.map((row: any) => ({
        region: row.city as string,
        avgInvoice: Number(row.avg_invoice),
      })) ?? [];

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unexpected server error" },
      { status: 500 }
    );
  }
}
```

你的前端 AvgInvoiceTable 完全不用改 URL，照舊：
fetch("/api/avg-invoice")就會吃到真正的 Supabase 資料 ✅


3️⃣ 接下來可以玩的應用方向
有了這三張表 + Supabase，其實可以做滿多東西：
縣市比較儀表板（可以用前端自己畫或用 Supabase + Metabase / Grafana）

每縣市：
最新平均發票金額（餐飲業）
餐飲店家數、餐飲總營業額
飲料公司數量
排行、熱度圖、長條圖都可以玩。
你的門市 / 模擬門市 vs 縣市平均

之後如果你有自家店的發票資料，可以加一張 my_shop_sales 表

用 SQL 做：
my_avg_invoice vs city_avg_invoice
my_sales vs avg_sales_per_restaurant

未來的 API
/api/city-summary → 回傳每縣市綜合指標（客單價、營業額、店數）
/api/beverage-density → 各縣市「飲料店密度」
/api/city-detail?city=台北市 → 單一縣市的細部數據（方便做 drill-down 頁面）


### 
```sql
```