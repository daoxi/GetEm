import { useMemo, useRef, useState } from "react";
import {
	Row,
	Col,
	Stack,
	Button,
	Form,
	Card,
	Badge,
	InputGroup,
	Tooltip,
	Overlay,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Note, Tag, TagWithNoteInfo } from "./App";
import styles from "./NoteList.module.css";
import { EditTagsModal } from "./EditTagsModal";

type NoteListProps = {
	tagsWithNotesInfo: TagWithNoteInfo[];
	notes: Note[];
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
};

export function NoteList({
	tagsWithNotesInfo,
	notes,
	onUpdateTag,
	onDeleteTag,
}: NoteListProps) {
	const tagsUsedByNotes = tagsWithNotesInfo.filter(
		(tag) => tag.isUsedByNotes === true
	); //this stores only tags that are used by note(s) (i.e. excluding tags that don't belong to any note)
	const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

	const [title, setTitle] = useState("");

	const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

	//both for displaying Bootstrap <Tooltip>
	const tagsSelectRef = useRef(null);
	const [showTagsSelectTooltip, setShowTagsSelectTooltip] = useState(false);

	const filteredNotes = useMemo(() => {
		return notes.filter((note) => {
			//checks for whether both the title and the tags match the search, returns a boolean
			return (
				//check for title, making it case-insensitive
				(title === "" ||
					note.title.toLowerCase().includes(title.toLowerCase())) &&
				//check for tags, for "every" selected tag, it should match "some" (i.e. at least one) tag for the note
				(selectedTags.length === 0 ||
					selectedTags.every((tag) =>
						note.tags.some((noteTag) => noteTag.id === tag.id)
					))
			);
		});
	}, [title, selectedTags, notes]);

	return (
		<>
			<Row className="align-items-center mb-4">
				<Col>
					<h1>Notes</h1>
				</Col>
				<Col
					xs="auto" /* use this to push the buttons all the way to the right side */
				>
					<Stack gap={2} direction="horizontal">
						<Link to="/new">
							<Button variant="success">Create New Note</Button>
						</Link>
					</Stack>
				</Col>
			</Row>
			<Card className="mb-3">
				<Card.Body>
					<Card.Title>Search 🔍</Card.Title>
					<Form>
						<Stack gap={3}>
							<Form.Group controlId="title">
								<InputGroup>
									<InputGroup.Text>Title</InputGroup.Text>
									<Form.Control
										type="text"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										disabled={notes.length === 0}
										placeholder={
											notes.length === 0
												? "You haven't added any note yet"
												: "Search as you type"
										}
									/>
								</InputGroup>
							</Form.Group>
							<Form.Group controlId="tags">
								<InputGroup>
									<InputGroup.Text>Tags</InputGroup.Text>
									<Col
										ref={tagsSelectRef}
										/* Use <Col> to wrap <ReactSelect> in order to properly display the Bootstrap <Tooltip> */
									>
										<ReactSelect
											//Chose ReactSelect component here (instead of CreatableReactSelect), because no new tag will be created

											value={selectedTags.map((tag) => {
												//CreatableReactSelect expects a label and an id
												return { label: tag.label, value: tag.id };
											})}
											options={tagsUsedByNotes.map((tag) => {
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
											inputId="tags" //matches controlId from parent component <Form.Group>
											className="rounded-0 flex-fill" //use flex-fill to grow to match the remaining width (not mandatory if the component is already wrapped by <Col>)
											isDisabled={tagsUsedByNotes.length === 0}
											placeholder={
												tagsUsedByNotes.length === 0
													? "You haven't added any tags to any note yet"
													: "Select one from the dropdown or search"
											}
											noOptionsMessage={(userinput) =>
												userinput.inputValue === ""
													? "You haven't added any tags to any note yet"
													: 'No tags were found from your search "' +
													  userinput.inputValue +
													  '"'
											}
											onFocus={() => {
												setShowTagsSelectTooltip(true);
											}}
											onBlur={() => {
												setShowTagsSelectTooltip(false);
											}}
											styles={{
												control: (baseStyles) => ({
													...baseStyles,
													//remove rounded corners on left and right side to align with elements on both sides better
													borderRadius: 0,
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
						</Stack>
					</Form>
				</Card.Body>
			</Card>
			<Row
				xs={1}
				sm={2}
				lg={3}
				xl={4}
				/* Set number of columns for each screen size */ className="g-3" /* for gap */
			>
				{filteredNotes.map((note) => (
					<Col key={note.id}>
						<NoteCard
							id={note.id}
							title={note.title}
							body={note.body}
							tags={note.tags}
						/>
					</Col>
				))}
			</Row>
			<EditTagsModal
				show={editTagsModalIsOpen}
				handleClose={() => setEditTagsModalIsOpen(false)}
				tagsWithNotesInfo={tagsWithNotesInfo}
				onUpdateTag={onUpdateTag}
				onDeleteTag={onDeleteTag}
			/>
			<Overlay //fundamental component for positioning and controlling <Tooltip> visibility
				target={tagsSelectRef.current}
				show={showTagsSelectTooltip}
				placement="top"
			>
				{
					//passing injected props from <Overlay> directly to the <Tooltip> component
					(props) => (
						<Tooltip id="tags-select-overlay" {...props}>
							Unused tags are excluded
						</Tooltip>
					)
				}
			</Overlay>
		</>
	);
}

function NoteCard({
	/* also include "body" here if needed */
	id,
	title,
	tags,
}: Note) {
	return (
		<Card
			as={Link}
			to={`/${id}`}
			className={`h-100 text-reset text-decoration-none ${styles.card}`} /* h-100 to fill the full height, ${styles.card} for CSS module for more detailed styles */
		>
			<Card.Body>
				<Stack
					gap={2}
					className="h-100 align-items-center justify-content-center"
				>
					<span className="fs-5">{title}</span>
					{tags.length > 0 && (
						<Stack
							gap={1}
							direction="horizontal"
							className="justify-content-center flex-wrap"
						>
							{tags.map((tag) => (
								<Badge
									className="text-truncate"
									/* prevents long text overflow */ key={tag.id}
								>
									{tag.label}
								</Badge>
							))}
						</Stack>
					)}
				</Stack>
			</Card.Body>
		</Card>
	);
}
