//Used for both creating new and and editing existing notes

import {Form,Stack, Col, Row} from "react-bootstrap";

export function NoteForm () {
	return (<>
	<Form>
		<Stack gap={4}>
		<Row>
			<Col>
			<Form.Group controlId="title">
				<Form.Label>Title</Form.Label>
				<Form.Control required />
			</Form.Group>
			</Col> 
			<Col>
			<Form.Group controlId="tags">
				<Form.Label>Tags</Form.Label>
				<Form.Select required />
			</Form.Group>
			</Col> 
			</Row>
		</Stack>
	</Form>
	</>);
}
