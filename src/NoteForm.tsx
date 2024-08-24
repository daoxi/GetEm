//Used for both creating new and and editing existing notes

import { FormEvent, useRef, useState } from "react";
import { Form, Stack, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "./App";

type NoteFormProps = {
	onSubmit: (data: NoteData) => void;
};

export function NoteForm({ onSubmit }: NoteFormProps) {
	
	const titleRef = useRef<HTMLInputElement>(null);
	const markdownRef = useRef<HTMLTextAreaElement>(null);
	const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

	function handleSubmit(e: FormEvent) {
		e.preventDefault();

		onSubmit({
			//these values can't be null because they're required (as specified in the <Form.Control/> components), hence the non-null type assertion
			title: titleRef.current!.value,
			markdown: markdownRef.current!.value,
			tags: [],
		});
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
								<CreatableReactSelect
									value={selectedTags.map((tag) => {
										//CreatableReactSelect expects a label and an id
										return { label: tag.label, value: tag.id };
									})}
									onChange={(tags) => {
										setSelectedTags(
											tags.map((tag) => {
												//This is what is actually stored, which can be converted from what CreatableReactSelect expects
												return { label: tag.label, id: tag.value };
											})
										);
									}}
									isMulti
								/>
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
						<Link to=".." /* go back to the previous visited page */>
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
