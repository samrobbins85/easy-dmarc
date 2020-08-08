import { useRouter } from "next/router";
import { parseCookies, setCookie, destroyCookie } from "nookies";
export default function Login({ cookies }) {
	return (
		<div>
			<h1>Hello</h1>
			<ul>
				{ cookies && Object.entries(cookies).map(([name, val]) => (
					<li key={name}>
						{name}: {val}
					</li>
				))}
			</ul>
		</div>
	);
}

export async function getServerSideProps(context) {
	const data = context.query.code;
	const cookies = parseCookies(context);

	const rsp = await fetch("https://api.vercel.com/v2/oauth/access_token", {
		method: "POST",
		body: "client_id=" + encodeURIComponent(process.env.ID) +
			  "&client_secret=" + encodeURIComponent(process.env.SECRET) +
			  "&code=" + encodeURIComponent(data) +
			  "&redirect_uri=" + encodeURIComponent("http://localhost:3000/login"),
		headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			}
		}
	);
	
	const body = await rsp.json();
	const token = body["access_token"];
	
	setCookie(context, "token", token, {
		maxAge: 60 * 60 * 24,
		path: "/",
	});

	return { props: { cookies } }
}
