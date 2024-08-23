//Used for both creating new and and editing existing notes

import { FormEvent, useRef } from "react";
import { Form, Stack, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";

export function NoteForm() {
	const titleRef= useRef<HTMLInputElement>(null);
	const markdownRef = useRef<HTMLTextAreaElement>(null);

function handleSubmit(e: FormEvent){
	e.preventDefault();


	
}

	return (
		<>
			<Form onSubmit={handleSubmit}>
				<Stack gap={4}>
					<Row>
						<Col>
							<Form.Group controlId="title">
								<Form.Label>Title</Form.Label>
								<Form.Control ref={titleRef} required />
							</Form.Group>
						</Col>
						<Col>
							<Form.Group controlId="tags">
								<Form.Label>Tags</Form.Label>
								<CreatableReactSelect isMulti />
							</Form.Group>
						</Col>
					</Row>
					<Form.Group controlId="markdown">
						<Form.Label>Body</Form.Label>
						<Form.Control required as="textarea" ref={markdownRef} rows={18} />
					</Form.Group>
					<Stack direction="horizontal" gap={3} className="justify-content-end">
						<Button type="submit" variant="primary">
							Save
						</Button>
						<Link to=".." /* go back to the previous visited page */ >
							<Button type="button" variant="outline-secondary">
								Cancel
							</Button>
						</Link>
					</Stack>
				</Stack>
			</Form>
		</>
	);
}
