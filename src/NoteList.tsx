import { Row, Col, Stack, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export function NoteList() {
	return (
		<>
			<Row>
				<Col>
					<h1>Notes</h1>
				</Col>
				<Col xs="auto" /* use this to push the buttons all the way to the right side */>
					<Stack gap={2} direction="horizontal">
						<Link to="/new">
							<Button variant="primary">Create</Button>
						</Link>
					</Stack>
				</Col>
			</Row>
		</>
	);
}
