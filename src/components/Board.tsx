"use client";
// https://www.hyperui.dev/
import { useRef, useState } from "react";
import CountsTable from "./list/CountsTable";
import AvgInvoiceTable from "./list/AvgInvoiceTable";
import RevenueShare from "./list/RevenueShare";
import CitySummaryTable from "./list/CitySummaryTable";

export default function Board() {
	const tabs = ["綜合縣市指標", "各縣市飲料店家數", "每家飲料店平均發票金額", "飲料占餐飲營收比例"];
	const [active, setActive] = useState(0);
	const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
	const touchStartX = useRef<number | null>(null);
	const touchCurrentX = useRef<number | null>(null);
	const SWIPE_THRESHOLD = 50; // pixels

	const focusAndSet = (index: number) => {
		const i = (index + tabs.length) % tabs.length;
		setActive(i);
		const el = tabsRef.current[i];
		if (el) el.focus();
	};

	const onKeyDown = (e: React.KeyboardEvent, index: number) => {
		switch (e.key) {
			case "ArrowRight":
				e.preventDefault();
				focusAndSet(index + 1);
				break;
			case "ArrowLeft":
				e.preventDefault();
				focusAndSet(index - 1);
				break;
			case "Home":
				e.preventDefault();
				focusAndSet(0);
				break;
			case "End":
				e.preventDefault();
				focusAndSet(tabs.length - 1);
				break;
			default:
				break;
		}
	};

	return (
		<>
			<section className="container mx-auto p-6">
				<h1 className="text-2xl md:text-3xl text-center font-semibold text-gray-900 dark:text-white mb-4">台灣飲料店 / 手搖飲市場分析</h1>
				<div className="border-b-2 border-black">
					<div role="tablist" aria-label="Sample Tabs" className="-mb-0.5 flex">
						{tabs.map((label, i) => (
							<button
								key={label}
								id={`tab-${i}`}
								role="tab"
								aria-selected={active === i}
								aria-controls={`panel-${i}`}
								tabIndex={active === i ? 0 : -1}
								ref={(el) => { tabsRef.current[i] = el; }}
								onClick={() => setActive(i)}
								onKeyDown={(e) => onKeyDown(e, i)}
								className={
									"cursor-pointer border-2 px-6 py-2 font-semibold focus:ring-2 focus:outline-0 rounded-none " +
									(active === i
										? "border-black text-white"
										: "border-transparent hover:bg-black hover:text-white")
								}
								style={active === i ? { backgroundColor: "#657C6A" } : undefined}
							>
								{label}
							</button>
						))}
					</div>
				</div>

				{tabs.map((label, i) => (
					<div
						key={label}
						id={`panel-${i}`}
						role="tabpanel"
						aria-labelledby={`tab-${i}`}
						hidden={active !== i}
						className={
							"-mt-0.5 border-2 border-black p-4 shadow-[4px_4px_0_0] h-100 " +
							(active === i ? "block" : "hidden")
						}
						onTouchStart={(e) => {
							touchStartX.current = e.touches[0].clientX;
							touchCurrentX.current = e.touches[0].clientX;
						}}
						onTouchMove={(e) => {
							touchCurrentX.current = e.touches[0].clientX;
						}}
						onTouchEnd={() => {
							if (touchStartX.current == null || touchCurrentX.current == null) return;
							const delta = touchCurrentX.current - touchStartX.current;
							if (Math.abs(delta) > SWIPE_THRESHOLD) {
								if (delta < 0) {
									// swipe left -> next tab
									setActive((s) => (s + 1) % tabs.length);
								} else {
									// swipe right -> prev tab
									setActive((s) => (s - 1 + tabs.length) % tabs.length);
								}
							}
							touchStartX.current = null;
							touchCurrentX.current = null;
						}}
					>
						<div>
							{i === 0 && <CountsTable />}
							{i === 1 && <AvgInvoiceTable />}
							{i === 2 && <RevenueShare />}
							{i === 3 && <CitySummaryTable />}
						</div>
					</div>
				))}
			</section>
		</>
	);
}
