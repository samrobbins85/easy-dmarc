import { useState } from "react";
import Cookies from "js-cookie";

export default function DetectSPF(props) {
	const [resp, setResponse] = useState("Hello");
	fetch(`https://api.vercel.com/v2/domains/${props.domain}/records?since=0`, {
		headers: {
			Authorization: "Bearer " + Cookies.get("token"),
		},
	})
		.then((res) => res.json())
		.then((result) => {
			setResponse(
				result.records.find(
					(element) =>
						element.type === "TXT" &&
						element.value.startsWith("v=spf")
				)
			);
		});
	if (resp !== undefined) {
		return <h1>Has SPF</h1>;
	} else {
		return <h2>Doesn't have SPF</h2>;
	}
}
