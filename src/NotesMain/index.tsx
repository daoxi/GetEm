//Icon imports start
import { MdCreate } from "react-icons/md";
import { MdSettings } from "react-icons/md";
//Icon imports end
import { useEffect, useMemo, useRef, useState } from "react";
import {
	Row,
	Col,
	Stack,
	Button,
	Form,
	InputGroup,
	Tooltip,
	Overlay,
	Tabs,
	Tab,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Note, Options, TagWithNotesInfo } from "../App";
import { NotesList } from "./NotesList";

type NoteListProps = {
	options: Options;
	onUpdateOptions: (optionName: string, newValue: any) => void;
	handleOpenOptionsModal: () => void;
	notesWithTags: Note[];
	onDeleteNoteWithConfirm: (id: string) => void;
	onReorderNotes: (activeId: string, overId: string) => void;
	tagsWithNotesInfo: TagWithNotesInfo[];
	setEditTagsModalIsOpen: (newEditTagsModalIsOpen: boolean) => void;
};

export function NotesMain({
	options,
	onUpdateOptions,
	handleOpenOptionsModal,
	notesWithTags,
	onDeleteNoteWithConfirm,
	onReorderNotes,
	tagsWithNotesInfo,
	setEditTagsModalIsOpen,
}: NoteListProps) {
	const tagsUsedByNotes = tagsWithNotesInfo.filter(
		(tag) => tag.isUsedByNotes === true
	); //this stores only tags that are used by note(s) (i.e. excluding tags that don't belong to any note)

	const [selectedTags, setSelectedTags] = useState<TagWithNotesInfo[]>([]);

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

	function handleExcludeUnusedTagsOn() {
		//remove unused tags from the selected tags
		setSelectedTags((prevTags) => {
			return prevTags.filter((prevTag) => prevTag.isUsedByNotes);
		});
	}

	//update the selectedTags whenever the tags (from parent component) get edited or deleted (keep the order of tags unchanged in selectedTags)
	useEffect(() => {
		setSelectedTags((prevTags) => {
			return prevTags
				.filter((prevTag) =>
					tagsWithNotesInfo.some(
						(tagWithNotesInfo) => tagWithNotesInfo.id === prevTag.id
					)
				) /* first filter out those tags that have been deleted */
				.map(
					(prevTag) =>
						tagsWithNotesInfo.find(
							(tagWithNotesInfo) => tagWithNotesInfo.id === prevTag.id
						)! /* using non-null type assertion because those deleted tags that can't be found have already been filtered out */
				);
		});
	}, [tagsWithNotesInfo]);

	return (
		<>
			<Row
				xs={1}
				sm={1}
				md={1}
				lg={2}
				xl={2}
				xxl={2}
				/* Set number of columns for different screen sizes */ className="align-items-center mb-4"
			>
				<Col>
					<h1>Getem</h1>
				</Col>
				<Col
				//xs="auto" /* use this to push the buttons all the way to the right side */
				>
					<Stack gap={2} direction="horizontal" className="justify-content-end">
						<Link to="/new">
							<Button variant="success">
								<Stack gap={1} direction="horizontal">
									<span>Create New Note</span>
									<div className="d-flex align-items-center">
										<MdCreate />
									</div>
								</Stack>
							</Button>
						</Link>
						<Button
							variant="dark"
							onClick={() => handleOpenOptionsModal()}
							className=""
						>
							<Stack gap={1} direction="horizontal">
								<span>Options</span>
								<div className="d-flex align-items-center">
									<MdSettings />
								</div>
							</Stack>
						</Button>
					</Stack>
				</Col>
			</Row>
			<Tabs
				id="controlled-tab-notes"
				activeKey={
					options.activeMainTabKey ? options.activeMainTabKey : "search"
				} //default to "search" when this option hasn't been set yet
				onSelect={
					(k) =>
						onUpdateOptions(
							"activeMainTabKey",
							k!
						) /* Used non-null operator because every <Tab> has the eventKey attribute */
				}
				className=""
				justify
			>
				<Tab
					eventKey="search"
					title={<b>Search</b>}
					className="mb-3 p-3 border border-top-0 rounded rounded-top-0"
				>
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
												? "No notes created yet"
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
										style={{
											minWidth: 0 /* set this on the parent element of the react-select component, to indicate it's okay to shrink, 
											and this fixes the issue that when having very long input or tags, the react-select component will expand past the expected width */,
										}}
									>
										<ReactSelect
											//Chose ReactSelect component here (instead of CreatableReactSelect), because no new tag will be created

											value={selectedTags.map((tag) => {
												//CreatableReactSelect expects at least a label and a value (i.e. id), in this case isUsedByNotes is an additional custom property
												return {
													label: tag.label,
													value: tag.id,
													isUsedByNotes: tag.isUsedByNotes,
												};
											})}
											options={
												options.excludeUnusedTagsForSearch === true ||
												options.excludeUnusedTagsForSearch ===
													undefined /* this option is assumed to be true when undefined */
													? tagsUsedByNotes.map((tag) => {
															return {
																label: tag.label,
																value: tag.id,
																isUsedByNotes: tag.isUsedByNotes,
															};
													  })
													: tagsWithNotesInfo.map((tag) => {
															return {
																label: tag.label,
																value: tag.id,
																isUsedByNotes: tag.isUsedByNotes,
															};
													  })
											}
											onChange={(tags) => {
												setSelectedTags(
													tags.map((tag) => {
														//This is what is actually stored, which can be converted from what CreatableReactSelect expects
														return {
															label: tag.label,
															id: tag.value,
															isUsedByNotes: tag.isUsedByNotes,
														};
													})
												);
											}}
											isMulti
											inputId="tags" //matches controlId from parent component <Form.Group>
											className="rounded-0 flex-fill" //use flex-fill to grow to match the remaining width (not mandatory if the component is already wrapped by <Col>)
											isDisabled={tagsUsedByNotes.length === 0}
											placeholder={
												tagsUsedByNotes.length === 0
													? "No tags added to any note"
													: "Search/select from dropdown"
											}
											noOptionsMessage={(userinput) =>
												userinput.inputValue === ""
													? "You haven't added any tag to any note yet"
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
												menu: (baseStyles) => ({
													...baseStyles,
													overflowWrap: "anywhere", //do this to prevent dropdown menu horizontal scroll on very-long single word
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
						</Stack>
					</Form>
					<Form className="mt-2">
						<Form.Check
							type={`checkbox`}
							id={`search-mode-tab-toggle-excludeUnusedTagsForSearch`}
							label={`Exclude unused tags from searchable tags (recommended)`}
							disabled={tagsUsedByNotes.length === 0}
							checked={
								options.excludeUnusedTagsForSearch === undefined
									? true
									: options.excludeUnusedTagsForSearch
							} //default value is assumed to be true when undefined
							onChange={(e) => {
								onUpdateOptions("excludeUnusedTagsForSearch", e.target.checked);
								if (e.target.checked) {
									handleExcludeUnusedTagsOn();
								}
							}}
						/>
					</Form>
				</Tab>
				<Tab
					eventKey="manage"
					title={<b>Manage</b>}
					className="mb-3 p-3 border border-top-0 rounded rounded-top-0"
				>
					<Stack gap={3}>
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
								<div
									className="d-grid gap-3" /* In <Button>'s direct-parent element, "d-grid" or <Stack> makes button(s) block-level (i.e. full width) */
								>
									<Button
										onClick={() => setEditTagsModalIsOpen(true)}
										variant="primary"
									>
										Edit All Tags
									</Button>
								</div>
							</Col>
						</Row>
						<Form>
							<Form.Check
								type={`checkbox`}
								id={`manage-mode-tab-toggle-deleteNoteRequireConfirm`}
								label={`Require confirmation when deleting a note`}
								checked={
									options.deleteNoteRequireConfirm === undefined
										? true
										: options.deleteNoteRequireConfirm
								} //default value is assumed to be true when undefined
								onChange={(e) => {
									onUpdateOptions("deleteNoteRequireConfirm", e.target.checked);
								}}
							/>
						</Form>
						<span>
							Tip: use the dotted pattern (
							<span style={{ color: "rgba(0, 0, 0, 0.1)" }}>●</span>) to drag
							and drop the notes to reorder them.
						</span>
					</Stack>
				</Tab>
			</Tabs>
			{options.activeMainTabKey === undefined ||
			options.activeMainTabKey ===
				"search" /* default to "search" when this option hasn't been set yet */ ? (
				notesWithTags.length !== 0 ? (
					filteredNotes.length !== 0 ? (
						<NotesList notesMode="view" notesToList={filteredNotes} />
					) : (
						<p>Your search didn't match any notes.</p>
					)
				) : (
					<p /* don't show any tip if the user hasn't created any notes, because the search field already shows the needed tip */
					></p>
				)
			) : options.activeMainTabKey === "manage" ? (
				notesWithTags.length !== 0 ? (
					<NotesList
						notesMode="manage"
						notesToList={notesWithTags}
						onReorderNotes={onReorderNotes}
						onDeleteNoteWithConfirm={onDeleteNoteWithConfirm}
					/>
				) : (
					<p>You haven't created any note yet.</p>
				)
			) : (
				<p>The active tab is unknown.</p>
			)}

			<Overlay //fundamental component for positioning and controlling <Tooltip> visibility
				target={tagsSelectRef.current}
				show={
					showTagsSelectTooltip &&
					!options.hideTooltips &&
					selectedTags.some((tag) => tag.isUsedByNotes === false) //show the tooltip when 1 or more selected tags are unused
				}
				placement="top"
			>
				{
					//passing injected props from <Overlay> directly to the <Tooltip> component
					(props) => (
						<Tooltip id="tags-select-overlay" {...props}>
							contains unused tag(s), which returns no search result.
						</Tooltip>
					)
				}
			</Overlay>
		</>
	);
}
