import { useRouter } from "next/router";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

export default function Login({ cookies }) {
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [items, setItems] = useState([]);
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
					console.log(result.domains.map((item) => item.name));
					setItems(result.domains.map((item) => item.name));
				},

				(error) => {
					setIsLoaded(true);
					setError(error);
				}
			);
	}, []);
	return (
		<div>
			<h1>Hello</h1>
			<ul>
				{!error &&
					isLoaded &&
					items.map((item) => <li key={item}>{item}</li>)}
			</ul>
			{Cookies.get("token")}
		</div>
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
