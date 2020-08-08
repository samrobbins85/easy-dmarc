import Select from "react-select";
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
				"; rua=mailto:" +
				email +
				"; ruf=mailto:" +
				email +
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
					<div className="pb-4">
						Policy:
						<select
							className="form-select"
							value={policy}
							onChange={changePolicy}
						>
							<option value="none">None</option>
							<option value="quarantine">Quarantine</option>
							<option value="reject">Reject</option>
						</select>
					</div>
					<div
						className="pb-4"
						value={subdomainPolicy}
						onChange={subPolicy}
					>
						Policy for Subdomains:
						<select className="form-select">
							<option value="none">None</option>
							<option value="quarantine">Quarantine</option>
							<option value="reject">Reject</option>
						</select>
					</div>
					<label className="block">
						Email:
						<input
							type="text"
							className="form-input"
							value={email}
							onChange={changeEmail}
						/>
					</label>
					<label className="block">
						Servers in the domain that can send email:
						<textarea
							type="text"
							className="form-textarea"
							value={inDomain}
							onChange={indomain}
						/>
					</label>
					<label className="block">
						External domains that may deliver or relay mail:
						<textarea
							type="text"
							className="form-textarea"
							value={outDomain}
							onChange={outdomain}
						/>
					</label>
					<div className="pb-4">
						How strict should the servers be treating the emails:
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
