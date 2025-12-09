'use client';
// https://www.hyperui.dev/
export default function Header() {
	return (
		<>
			<header className="bg-[#BB3E00] dark:bg-gray-900">
				<div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
					<a className="block text-white flex" href="#">
						<span className="sr-only">Home</span>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
							<rect width="24" height="24" fill="none" />
							<path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17.95 9l-1.478 8.69c-.25 1.463-.374 2.195-.936 2.631c-1.2.931-6.039.88-7.172 0c-.562-.436-.687-1.168-.936-2.632L5.95 9M6 9l.514-1.286a5.908 5.908 0 0 1 10.972 0L18 9M5 9h14m-7 0l4-7m-5.99 12h.01m1 4h.01m1.99-2h.01" />
						</svg>
						<span className="ml-2 text-white">Tea Mark</span>
					</a>

					<div className="flex flex-1 items-center justify-end md:justify-between">
						<nav aria-label="Global" className="hidden md:block">
							<ul className="flex items-center gap-6 text-sm">
								{/* <li>
									<a className="text-gray-500 transition hover:text-gray-500/75" href="#"> About </a>
								</li> */}
							</ul>
						</nav>

						<div className="flex items-center gap-4">
							<div className="sm:flex sm:gap-4">
								{/* <a className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700" href="#">
									Login
								</a> */}
								<a className="hidden rounded-md bg-[#BB3E00] px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75 sm:block" href="mailto: christinachen149@gmail.com">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										<rect width="24" height="24" fill="none" />
										<g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
											<path stroke-dasharray="64" stroke-dashoffset="64" d="M4 5h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-12c0 -0.55 0.45 -1 1 -1Z">
												<animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
											</path>
											<path stroke-dasharray="24" stroke-dashoffset="24" d="M3 6.5l9 5.5l9 -5.5">
												<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="24;0" />
											</path>
										</g>
									</svg>
								</a>
								{/* <a className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75 sm:block" href="#">
									Register
								</a> */}
							</div>
							{/* <button className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
								<span className="sr-only">Toggle menu</span>
								<svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
								</svg>
							</button> */}
						</div>
					</div>
				</div>
			</header>
		</>
	);
}