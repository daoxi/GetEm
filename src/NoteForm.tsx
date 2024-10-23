//Used for both creating new and and editing existing notes

import { FormEvent, useRef, useState } from "react";
import { Form, Stack, Col, Row, Button, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Options, Tag, TagWithNotesInfo } from "./App";
import { v4 as uuidV4 } from "uuid";

type NoteFormProps = {
	options: Options;
	onSubmit: (data: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	tagsWithNotesInfo: TagWithNotesInfo[];
	setEditTagsModalIsOpen: (newEditTagsModalIsOpen: boolean) => void;
} & Partial<NoteData>; // use Partial to make NoteData optional

export function NoteForm({
	options,
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
	const [noteFormTitle, setNoteFormTitle] = useState(title);

	const navigate = useNavigate();
	const location = useLocation();
	function navigateBack() {
		if (
			location.key === "default"
			/* this checks whether the react-router history stack is empty, which implies the previously-visited page is outside of the app (e.g. when manually copying app URL into address bar) */
		) {
			navigate("/"); /* navigate back to homepage */
		} else {
			navigate(
				-1
			); /* navigate back to the previous visited page (which should be within the app, thanks to the condition checking) */
		}
	}

	function handleSubmit(e: FormEvent) {
		e.preventDefault();

		onSubmit({
			//these values can't be null because they're required (as specified in the <Form.Control/> components), hence the non-null type assertion
			title: titleRef.current!.value,
			body: bodyRef.current!.value,
			tags: selectedTags,
		});

		navigateBack();
	}

	return (
		<>
			<Form onSubmit={handleSubmit}>
				<Stack gap={4}>
					<Row
						xs={1}
						sm={1}
						md={1}
						lg={2}
						xl={2}
						xxl={2}
						/* Set number of columns for different screen sizes */
					>
						<Col>
							<Form.Group controlId="title">
								<Form.Label>Title</Form.Label>
								<Form.Control
									ref={titleRef}
									required
									value={noteFormTitle}
									onChange={(e) => {
										setNoteFormTitle(e.target.value);
									}}
									maxLength={options.maxNoteTitleLength}
									aria-describedby="titleInputHelp"
								/>
								<Form.Text id="titleInputHelp" muted>
									You can enter{" "}
									{options.maxNoteTitleLength - noteFormTitle.length} more
									characters.
								</Form.Text>
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
										Edit
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
						<Button
							type="button"
							variant="outline-secondary"
							onClick={() => navigateBack()}
						>
							Cancel
						</Button>
					</Stack>
				</Stack>
			</Form>
		</>
	);
}
