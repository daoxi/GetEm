//Used for both creating new and and editing existing notes

import { FormEvent, useRef, useState } from "react";
import { Form, Stack, Col, Row, Button, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag, TagWithNotesInfo } from "./App";
import { v4 as uuidV4 } from "uuid";

type NoteFormProps = {
	onSubmit: (data: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	tagsWithNotesInfo: TagWithNotesInfo[];
	setEditTagsModalIsOpen: (newEditTagsModalIsOpen: boolean) => void;
} & Partial<NoteData>; // use Partial to make NoteData optional

export function NoteForm({
	onSubmit,
	onAddTag,
	tagsWithNotesInfo,
	setEditTagsModalIsOpen,
	title = "",
	body = "",
	tags = [],
}: NoteFormProps) {
	const titleRef = useRef<HTMLInputElement>(null);
	const bodyRef = useRef<HTMLTextAreaElement>(null);
	const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
	const navigate = useNavigate();

	function handleSubmit(e: FormEvent) {
		e.preventDefault();

		onSubmit({
			//these values can't be null because they're required (as specified in the <Form.Control/> components), hence the non-null type assertion
			title: titleRef.current!.value,
			body: bodyRef.current!.value,
			tags: selectedTags,
		});

		//navigate to the previously visited page
		navigate("..");
	}

	return (
		<>
			<Form onSubmit={handleSubmit}>
				<Stack gap={4}>
					<Row>
						<Col>
							<Form.Group controlId="title">
								<Form.Label>Title</Form.Label>
								<Form.Control ref={titleRef} required defaultValue={title} />
							</Form.Group>
						</Col>
						<Col>
							<Form.Group controlId="tags">
								<Form.Label>Tags</Form.Label>
								<InputGroup>
									<Col>
										<CreatableReactSelect
											//onCreateOption is fired when user creates a new tag, label is the input that the user typed in
											onCreateOption={(label) => {
												const newTag = { id: uuidV4(), label };
												onAddTag(newTag);
												//automatically add new tag to the currently selected tags by default
												setSelectedTags((prev) => [...prev, newTag]);
											}}
											value={selectedTags.map((tag) => {
												//CreatableReactSelect expects a label and an id
												return { label: tag.label, value: tag.id };
											})}
											//when user creates a new tag, it does not fire onChange, instead it fires onCreateOption
											options={tagsWithNotesInfo.map((tags) => {
												return { label: tags.label, value: tags.id };
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
											inputId="tags" //matches controlId from parent component <Form.Group>
											className="flex-fill" //use flex-fill to grow to match the remaining width (not mandatory if the component is already wrapped by <Col>)
											placeholder="Add tags"
											noOptionsMessage={(userinput) =>
												userinput.inputValue === ""
													? "No selectable tags, start typing to add a new one"
													: 'No tags were found from your search "' +
													  userinput.inputValue +
													  '"'
											}
											styles={{
												control: (baseStyles) => ({
													...baseStyles,
													//remove rounded corners on right side to align with the button better
													borderTopRightRadius: 0,
													borderBottomRightRadius: 0,
												}),
											}}
										/>
									</Col>
									<Button
										onClick={() => setEditTagsModalIsOpen(true)}
										variant="primary"
									>
										Edit All Tags
									</Button>
								</InputGroup>
							</Form.Group>
						</Col>
					</Row>
					<Form.Group controlId="body">
						<Form.Label>Body</Form.Label>
						<Form.Control
							defaultValue={body}
							required
							as="textarea"
							ref={bodyRef}
							rows={18}
						/>
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
