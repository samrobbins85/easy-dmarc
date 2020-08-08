import { useRouter } from "next/router";
export default function Login({ data }) {
	return <h1>Hello</h1>;
}

export async function getServerSideProps(context) {
	const data = context.query.code;

	fetch("https://api.vercel.com/v2/oauth/access_token", {
		method: "POST",
		body: "client_id=" + encodeURIComponent(process.env.ID) +
			  "&client_secret=" + encodeURIComponent(process.env.SECRET) +
			  "&code=" + encodeURIComponent(data) +
			  "&redirect_uri=" + encodeURIComponent("http://localhost:3000/login"),
		headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}
	).then(rsp => rsp.json())
	.then(rsp => console.log(rsp));

	console.log(process.env.SECRET);
	return { props: { data } };
}
