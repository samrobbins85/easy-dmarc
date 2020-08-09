import { parseCookies, setCookie, destroyCookie } from "nookies";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

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
	return (
		<>
			<div className="flex justify-center pt-6">
				<form>
					<div class="grid grid-cols-2 gap-3">
						<p>Domain:</p>
						<select
							className="form-select"
							value={domain}
							onChange={() => setDomain(event.target.value)}
						>
							{!error &&
								isLoaded &&
								items.map((item) => (
									<option value={item}>{item}</option>
								))}
						</select>
						<p>Policy:</p>
						<select
							className="form-select"
							value={policy}
							onChange={() => setPolicy(event.target.value)}
						>
							<option value="none">None</option>
							<option value="quarantine">Quarantine</option>
							<option value="reject">Reject</option>
						</select>
						<p>Policy for Subdomains:</p>
						<select
							className="form-select"
							value={subdomainPolicy}
							onChange={() =>
								setSubdomainPolicy(event.target.value)
							}
						>
							<option value="none">None</option>
							<option value="quarantine">Quarantine</option>
							<option value="reject">Reject</option>
						</select>
						<p>Email:</p>
						<input
							type="text"
							className="form-input"
							value={email}
							onChange={() => setEmail(event.target.value)}
						/>
						<p>Servers in the domain that can send email:</p>
						<textarea
							type="text"
							className="form-textarea"
							value={inDomain}
							onChange={() => setInDomain(event.target.value)}
						/>
						<p>External domains that may deliver or relay mail:</p>
						<textarea
							type="text"
							className="form-textarea"
							value={outDomain}
							onChange={() => setOutDomain(event.target.value)}
						/>
						<p>
							How strict should the servers be treating the
							emails:
						</p>
						<select
							className="form-select"
							value={strict}
							onChange={() => setStrict(event.target.value)}
						>
							<option value="-all">Fail</option>
							<option value="~all">Soft Fail</option>
							<option value="?all">Neutral</option>
							<option value="+all">Allow all</option>
						</select>
					</div>
				</form>
			</div>
			<p>Dmarc{dmarc}</p>
			<p>SPF:{spf}</p>
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
			encodeURIComponent("http://localhost:3000/login"),
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
