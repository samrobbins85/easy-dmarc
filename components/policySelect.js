export default function PolicySelect() {
	return (
		<select onChange={(event) => setPolicy(event.target.value)}>
			<option value="none">None</option>
			<option value="quarantine">Quarantine</option>
			<option value="reject">Reject</option>
		</select>
	);
}
