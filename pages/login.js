import { useRouter } from "next/router";
export default function Login({ data }) {
	return <h1>Hello</h1>;
}

export async function getServerSideProps(context) {
	const data = context.query.code;
	console.log(process.env.SECRET);
	return { props: { data } };
}
