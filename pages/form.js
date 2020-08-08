import { useState, useEffect } from "react";
export default function Form() {
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
	return (
		<>
			<h1>Hello</h1>
			<div className="flex justify-center">
				<form>
					<div class="grid grid-cols-2 gap-3">
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
			<p>DMARC: {dmarc}</p>
			<br />
			<p>SPF: {spf}</p>
		</>
	);
}
