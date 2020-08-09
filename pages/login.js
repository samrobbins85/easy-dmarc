import { parseCookies, setCookie } from "nookies";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Head from "next/head";

export default function Login({ cookies }) {
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [items, setItems] = useState([]);
	const [domain, setDomain] = useState("");
	const [policy, setPolicy] = useState("none");
	const [subdomainPolicy, setSubdomainPolicy] = useState("none");
	const [email, setEmail] = useState("");
	const [dmarc, setDmarc] = useState("");
	const [spf, setSpf] = useState("");
	const [inDomain, setInDomain] = useState("");
	const [outDomain, setOutDomain] = useState("");
	const [strict, setStrict] = useState("~all");
	const [hasSPF, setHasSPF] = useState(false);
	const [hasDMARC, setHasDMARC] = useState(false);
	const [wantEdit, setWantEdit] = useState(false);

	useEffect(() => {
		setDmarc(
			"v=DMARC1; p=" +
				policy +
				`${email && "; rua=mailto:" + email}` +
				`${email && "; ruf=mailto:" + email}` +
				"; sp=" +
				subdomainPolicy +
				"; ri=86400"
		);
		setSpf(
			"v=spf1 mx " +
				inDomain
					.split(/\r?\n/)
					.filter((item) => item)
					.map((elem) => " a:" + elem)
					.join("") +
				outDomain
					.split(/\r?\n/)
					.filter((item) => item)
					.map((elem) => " include:" + elem)
					.join("") +
				" " +
				strict
		);
	});

	useEffect(() => {
		fetch("https://api.vercel.com/v5/domains", {
			headers: {
				Authorization: "Bearer " + Cookies.get("token"),
			},
		})
			.then((res) => res.json())
			.then(
				(result) => {
					setIsLoaded(true);
					setItems(result.domains.map((item) => item.name));
				},

				(error) => {
					setIsLoaded(true);
					setError(error);
				}
			);
	}, []);

	useEffect(() => {
		setWantEdit(false);
		if (domain !== "") {
			fetch(
				`https://api.vercel.com/v2/domains/${domain}/records?since=0`,
				{
					headers: {
						Authorization: "Bearer " + Cookies.get("token"),
					},
				}
			)
				.then((res) => res.json())
				.then((result) => {
					setHasSPF(
						result.records.find(
							(element) =>
								element.type === "TXT" &&
								element.value.startsWith("v=spf")
						)
					),
						setHasDMARC(
							result.records.find(
								(element) =>
									element.type === "TXT" &&
									element.value.startsWith("v=DMARC") &&
									element.name === "_dmarc"
							)
						);
				});
		}
	}, [domain]);

	function handleSubmit() {
		if (hasSPF) {
			fetch(
				`https://api.vercel.com/v2/domains/${domain}/records/${hasSPF.id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: "Bearer " + Cookies.get("token"),
					},
				}
			);
		}
		if (hasDMARC) {
			fetch(
				`https://api.vercel.com/v2/domains/${domain}/records/${hasDMARC.id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: "Bearer " + Cookies.get("token"),
					},
				}
			);
		}

		fetch(`https://api.vercel.com/v2/domains/${domain}/records`, {
			method: "POST",
			body: `{"name":"","type":"TXT","value":"${spf}"}`,
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + Cookies.get("token"),
			},
		});

		fetch(`https://api.vercel.com/v2/domains/${domain}/records`, {
			method: "POST",
			body: `{"name":"_dmarc","type":"TXT","value":"${dmarc}"}`,
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + Cookies.get("token"),
			},
		});
		return true;
	}

	return (
		<>
			<Head>
				<title>Easy DMARC | Set Up</title>
				<meta
					name="Description"
					content="A tool to make adding DMARC to a site easy"
				/>
			</Head>
			<h1 className="text-5xl font-semibold text-center pt-6">
				Set up DMARC
			</h1>
			<div className="flex justify-center pt-6">
				<br />
				<div>
					<div className="grid grid-cols-2 gap-3 pb-6">
						Domain:
						<select
							className="form-select"
							value={domain}
							onChange={() => setDomain(event.target.value)}
						>
							<option disabled value={""}>
								Select an option
							</option>
							{!error &&
								isLoaded &&
								items.map((item) => (
									<option key={item} value={item}>
										{item}
									</option>
								))}
						</select>
					</div>
					{domain !== "" && (
						<>
							<div className="flex justify-center py-4">
								<p className="px-6">
									DMARC
									{hasDMARC ? (
										<img
											className="inline-block"
											src="./available.svg"
										/>
									) : (
										<img
											className="inline-block"
											src="./not_available.svg"
										/>
									)}
								</p>

								<p className="px-6">
									SPF
									{hasSPF ? (
										<img
											className="inline-block"
											src="./available.svg"
										/>
									) : (
										<img
											className="inline-block"
											src="./not_available.svg"
										/>
									)}
								</p>
							</div>
							{hasSPF && hasDMARC && !wantEdit && (
								<>
									<p className="text-center text-xl py-6">
										You're already set up with both SPF and
										DMARC, click below if you want to edit
										the records
									</p>
									<div className="flex justify-center">
										<button
											onClick={() => setWantEdit(true)}
											className="p-2 px-4 transition duration-300 bg-black text-white rounded hover:bg-white hover:text-black border hover:border-black cursor-pointer"
										>
											Edit
										</button>
									</div>
								</>
							)}
							{(hasSPF === undefined ||
								hasDMARC == undefined ||
								wantEdit) && (
								<form onSubmit={handleSubmit}>
									<div className="grid grid-cols-2 gap-3">
										<p>Policy:</p>
										<select
											className="form-select"
											value={policy}
											onChange={() =>
												setPolicy(event.target.value)
											}
										>
											<option value="none">None</option>
											<option value="quarantine">
												Quarantine
											</option>
											<option value="reject">
												Reject
											</option>
										</select>
										<p>Policy for Subdomains:</p>
										<select
											className="form-select"
											value={subdomainPolicy}
											onChange={() =>
												setSubdomainPolicy(
													event.target.value
												)
											}
										>
											<option value="none">None</option>
											<option value="quarantine">
												Quarantine
											</option>
											<option value="reject">
												Reject
											</option>
										</select>
										<p>Email:</p>
										<input
											type="text"
											className="form-input"
											value={email}
											onChange={() =>
												setEmail(event.target.value)
											}
										/>
										<p>
											Servers in the domain that can send
											email:
										</p>
										<textarea
											type="text"
											className="form-textarea"
											value={inDomain}
											onChange={() =>
												setInDomain(event.target.value)
											}
										/>
										<p>
											External domains that may deliver or
											relay mail:
										</p>
										<textarea
											type="text"
											className="form-textarea"
											value={outDomain}
											onChange={() =>
												setOutDomain(event.target.value)
											}
										/>
										<p>
											How strict should the servers be
											treating the emails:
										</p>
										<select
											className="form-select"
											value={strict}
											onChange={() =>
												setStrict(event.target.value)
											}
										>
											<option value="-all">Fail</option>
											<option value="~all">
												Soft Fail
											</option>
											<option value="?all">
												Neutral
											</option>
											<option value="+all">
												Allow all
											</option>
										</select>
									</div>
									<div className="flex justify-center pt-6">
										<input
											type="submit"
											value="Submit"
											className="p-2 px-4 transition duration-300 bg-black text-white rounded hover:bg-white hover:text-black border hover:border-black cursor-pointer"
										/>
									</div>
								</form>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const data = context.query.code;
	const cookies = parseCookies(context);
	const rsp = await fetch("https://api.vercel.com/v2/oauth/access_token", {
		method: "POST",
		body:
			"client_id=" +
			encodeURIComponent(process.env.ID) +
			"&client_secret=" +
			encodeURIComponent(process.env.SECRET) +
			"&code=" +
			encodeURIComponent(data) +
			"&redirect_uri=" +
			encodeURIComponent("https://dmarc.vercel.app/login"),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});
	const body = await rsp.json();
	const token = body["access_token"];
	if (token) {
		setCookie(context, "token", token, {
			maxAge: 60 * 60 * 24,
			path: "/",
		});
	}

	return { props: { cookies } };
}
