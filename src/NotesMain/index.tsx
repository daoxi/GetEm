import { useMemo, useRef, useState } from "react";
import {
	Row,
	Col,
	Stack,
	Button,
	Form,
	Card,
	InputGroup,
	Tooltip,
	Overlay,
	Tabs,
	Tab,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Note, RawNote, Tag, TagWithNotesInfo } from "../App";

import { NotesList } from "./NotesList";

type NoteListProps = {
	notesWithTags: Note[];
	setNotes: (
		newNotes: RawNote[] | ((newNotes: RawNote[]) => RawNote[])
	) => void;
	onDeleteNote: (id: string) => void;
	tagsWithNotesInfo: TagWithNotesInfo[];
	setEditTagsModalIsOpen: (newEditTagsModalIsOpen: boolean) => void;
};

export function NotesMain({
	notesWithTags,
	setNotes,
	onDeleteNote,
	tagsWithNotesInfo,
	setEditTagsModalIsOpen,
}: NoteListProps) {
	const [activeTabKey, setActiveTabKey] = useState("search");

	const tagsUsedByNotes = tagsWithNotesInfo.filter(
		(tag) => tag.isUsedByNotes === true
	); //this stores only tags that are used by note(s) (i.e. excluding tags that don't belong to any note)
	const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

	const [title, setTitle] = useState("");

	//both for displaying Bootstrap <Tooltip>
	const tagsSelectRef = useRef(null);
	const [showTagsSelectTooltip, setShowTagsSelectTooltip] = useState(false);

	const filteredNotes = useMemo(() => {
		return notesWithTags.filter((noteWithTags) => {
			//checks for whether both the title and the tags match the search (if the search is empty, then always match it), returns a boolean
			return (
				//check for title, making it case-insensitive
				(title === "" ||
					noteWithTags.title.toLowerCase().includes(title.toLowerCase())) &&
				//check for tags, for "every" selected tag, it should match "some" (i.e. at least one) tag for the note
				(selectedTags.length === 0 ||
					selectedTags.every((tag) =>
						noteWithTags.tags.some((noteTag) => noteTag.id === tag.id)
					))
			);
		});
	}, [title, selectedTags, notesWithTags]);

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
			<Tabs
				id="controlled-tab-notes"
				activeKey={activeTabKey}
				onSelect={
					(k) =>
						setActiveTabKey(
							k!
						) /* Used non-null operator because every <Tab> has the eventKey attribute */
				}
				className="mb-3"
				justify
			>
				<Tab eventKey="search" title="Search" className="">
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
												disabled={notesWithTags.length === 0}
												placeholder={
													notesWithTags.length === 0
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
				</Tab>
				<Tab eventKey="manage" title="Manage">
					Tab content for Manage
				</Tab>
			</Tabs>
			{activeTabKey === "search" ? (
				notesWithTags.length !== 0 ? (
					filteredNotes.length !== 0 ? (
						<NotesList notesMode="view" notesToList={filteredNotes} />
					) : (
						<p>Your search didn't match any notes.</p>
					)
				) : (
					<p /* don't show any tip if the user hasn't added any notes, because the search field already shows the needed tip */
					></p>
				)
			) : activeTabKey === "manage" ? (
				notesWithTags.length !== 0 ? (
					<NotesList
						notesMode="manage"
						notesToList={notesWithTags}
						setNotes={setNotes}
						onDeleteNote={onDeleteNote}
					/>
				) : (
					<p>You haven't added any notes yet.</p>
				)
			) : (
				<p>The active tab is unknown.</p>
			)}

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
