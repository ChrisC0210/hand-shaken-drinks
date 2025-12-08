"use client";
// https://www.hyperui.dev/
export default function Footer() {
	return (
		<>
			<footer className="bg-[#BB3E00] dark:bg-gray-900">
				<div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
					<div className="sm:flex sm:items-center sm:justify-between">
						<div className="flex justify-center text-teal-600 sm:justify-start dark:text-teal-300">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<rect width="24" height="24" fill="none" />
								<path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17.95 9l-1.478 8.69c-.25 1.463-.374 2.195-.936 2.631c-1.2.931-6.039.88-7.172 0c-.562-.436-.687-1.168-.936-2.632L5.95 9M6 9l.514-1.286a5.908 5.908 0 0 1 10.972 0L18 9M5 9h14m-7 0l4-7m-5.99 12h.01m1 4h.01m1.99-2h.01" />
							</svg>
							<p className="ml-2 p-0 text-white">Tea Mark</p>
						</div>
						<p className="mt-4 text-center text-sm text-white lg:mt-0 lg:text-right dark:text-gray-400">
							Copyright © 2025. All rights reserved.
						</p>
					</div>
				</div>
			</footer>

		</>
	)
}