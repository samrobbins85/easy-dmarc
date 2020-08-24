import { useState } from "react";
import Cookies from "js-cookie";

export default function DetectSPF(props) {
	const [spf, setSPF] = useState("Loading");
	const [dmarc, setDMARC] = useState("Loading");
	if (spf === "Loading" || dmarc === "Loading") {
		fetch(
			`https://api.vercel.com/v2/domains/${props.domain}/records?since=0`,
			{
				headers: {
					Authorization: "Bearer " + Cookies.get("token"),
				},
			}
		)
			.then((res) => res.json())
			.then((result) => {
				setSPF(
					result.records.find(
						(element) =>
							element.type === "TXT" &&
							element.value.startsWith("v=spf")
					)
				);
				setDMARC(
					result.records.find(
						(element) =>
							element.type === "TXT" &&
							element.value.startsWith("v=DMARC") &&
							element.name === "_dmarc"
					)
				);
			});
	}
	// if (spf !== undefined) {
	// 	return <h1>Has SPF</h1>;
	// } else {
	// 	return <h2>Doesn't have SPF</h2>;
	// }
	return (
		<div className="flex justify-around col-span-4">
			<span>
				SPF:{" "}
				{spf === undefined ? (
					<img className="h-6 inline-block" src="not_available.svg" />
				) : (
					<img className="h-6 inline-block" src="available.svg" />
				)}
			</span>
			<span>
				DMARC:
				{dmarc === undefined ? (
					<img className="h-6 inline-block" src="not_available.svg" />
				) : (
					<img className="h-6 inline-block" src="available.svg" />
				)}
			</span>
		</div>
	);
}
