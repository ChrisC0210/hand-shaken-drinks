import Image from "next/image";

export default function AboutPage() {
	return (
		<section id="about" className="py-20 bg-gradient-to-br from-white to-yellow-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h2 className="text-4xl text-gray-900 mb-4">關於我們</h2>
					<p className="text-xl text-gray-600">了解我們的工作與團隊</p>
				</div>

				<div className="grid md:grid-cols-2 gap-12 items-center">
					<div className="space-y-6">
						<p className="text-gray-700 leading-relaxed">
							我們是一個充滿熱情的專業團隊，致力於為客戶提供最優質的服務。多年來，我們不斷創新，追求卓越，與客戶建立長期的合作關係。
						</p>
						<p className="text-gray-700 leading-relaxed">
							我們的團隊成員都具備豐富的經驗和專業知識，能夠為各種不同需求的客戶提供量身定制的解決方案。我們相信，只有真正了解客戶的需求，才能提供最合適的服務。
						</p>
						<p className="text-gray-700 leading-relaxed">
							無論您面臨什麼挑戰，我們都願意與您一起努力，找到最佳的解決方案。讓我們一起創造更美好的未來。
						</p>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="aspect-square bg-gradient-to-br from-amber-200 to-yellow-300 rounded-xl overflow-hidden">
							<Image
								src="/images/team-1.jpg"
								alt="團隊工作照"
								className="w-full h-full object-cover"
								width={800}
								height={800}
							/>
						</div>
						<div className="aspect-square bg-gradient-to-br from-yellow-200 to-amber-300 rounded-xl overflow-hidden">
							<Image
								src="/images/office-1.jpg"
								alt="辦公環境"
								className="w-full h-full object-cover"
								width={800}
								height={800}
							/>
						</div>
						<div className="aspect-square bg-gradient-to-br from-amber-300 to-yellow-200 rounded-xl overflow-hidden">
							<Image
								src="/images/meeting-1.jpg"
								alt="會議討論"
								className="w-full h-full object-cover"
								width={800}
								height={800}
							/>
						</div>
						<div className="aspect-square bg-gradient-to-br from-yellow-300 to-amber-200 rounded-xl overflow-hidden">
							<Image
								src="/images/office-2.jpg"
								alt="工作空間"
								className="w-full h-full object-cover"
								width={800}
								height={800}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
