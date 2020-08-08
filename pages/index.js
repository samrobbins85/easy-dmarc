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
			<div className="text-2xl text-center text-blue-600">
				<a href="https://vercel.com/oauth/authorize?client_id=oac_rWwV143gK1BrtELznk58Ylio">
					Sign In
				</a>
			</div>
		</>
	);
}
