import { useState } from "react";
import Cookies from "js-cookie";
import CheckIcon from "./checkicon";
import CrossIcon from "./crossicon";

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
	return (
		<>
			<td className="border border-gray-200 px-4">
				<div className="flex">
					{spf === undefined ? (
						<CrossIcon className="h-8 w-8 mx-auto text-red-600" />
					) : (
						<CheckIcon className="h-8 w-8 mx-auto text-green-600" />
					)}
				</div>
			</td>
			<td className="border border-gray-200 px-4">
				<div className="flex">
					{dmarc === undefined ? (
						<CrossIcon className="h-8 w-8 mx-auto text-red-600" />
					) : (
						<CheckIcon className="h-8 w-8 mx-auto text-green-600" />
					)}
				</div>
			</td>
		</>
	);
}
