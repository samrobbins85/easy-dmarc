import Select from "react-select";
import { useState, useEffect } from "react";
export default function Form() {
	const [policy, setPolicy] = useState("none");
	const [subdomainPolicy, setSubdomainPolicy] = useState("none");
	const [email, setEmail] = useState("");
	const [dmarc, setDmarc] = useState("");
	function changeEmail(event) {
		setEmail(event.target.value);
	}
	function changePolicy(event) {
		setPolicy(event.target.value);
	}

	function subPolicy(event) {
		setSubdomainPolicy(event.target.value);
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
				</form>
			</div>
			{dmarc}
		</>
	);
}
