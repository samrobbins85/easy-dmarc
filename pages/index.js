import Head from "next/head";
export default function IndexPage() {
	return (
		<>
			<Head>
				<title>Easy DMARC</title>
				<meta
					name="Description"
					content="A tool to make adding DMARC to a site easy"
				/>
			</Head>
			<div className="flex justify-center pt-6">
				<div className="grid text-center">
					<h1 className="text-5xl font-semibold pb-12 ">
						Easy DMARC
					</h1>
					<p className="text-lg pb-12 px-6 text-gray-700">
						Easily add DMARC to any of your domains hosted on Vercel
					</p>
					<div className="flex justify-center">
						<a
							className="bg-black p-4 text-white font-semibold rounded flex"
							href="https://vercel.com/oauth/authorize?client_id=oac_rWwV143gK1BrtELznk58Ylio"
						>
							<svg
								className="h-6"
								viewBox="0 0 116 100"
								fill="#fff"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M57.5 0L115 100H0L57.5 0z"
								/>
							</svg>
							<span className="inline-block px-8">
								Login with Vercel
							</span>
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
