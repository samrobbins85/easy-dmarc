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
	function changeEmail(event) {
		setEmail(event.target.value);
	}
	function changePolicy(event) {
		setPolicy(event.target.value);
	}

	function subPolicy(event) {
		setSubdomainPolicy(event.target.value);
	}
	function indomain(event) {
		setInDomain(event.target.value);
	}
	function outdomain(event) {
		setOutDomain(event.target.value);
	}
	function strictVal(event) {
		setStrict(event.target.value);
	}
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
		console.log(inDomain.split(/\r?\n/));
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
							onChange={changePolicy}
						>
							<option value="none">None</option>
							<option value="quarantine">Quarantine</option>
							<option value="reject">Reject</option>
						</select>
						<p>Policy for Subdomains:</p>
						<select
							className="form-select"
							value={subdomainPolicy}
							onChange={subPolicy}
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
							onChange={changeEmail}
						/>
						<p>Servers in the domain that can send email:</p>
						<textarea
							type="text"
							className="form-textarea"
							value={inDomain}
							onChange={indomain}
						/>
						<p>External domains that may deliver or relay mail:</p>
						<textarea
							type="text"
							className="form-textarea"
							value={outDomain}
							onChange={outdomain}
						/>
						<p>
							How strict should the servers be treating the
							emails:
						</p>
						<select
							className="form-select"
							value={strict}
							onChange={strictVal}
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
