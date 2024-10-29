//Used for both creating new and and editing existing notes

import { FormEvent, useEffect, useRef, useState } from "react";
import {
	Form,
	Stack,
	Col,
	Row,
	Button,
	InputGroup,
	Overlay,
	Tooltip,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Options, Tag, TagWithNotesInfo } from "./App";
import { v4 as uuidV4 } from "uuid";

type NoteFormProps = {
	options: Options;
	defaultOptions: Options;
	onSubmit: (data: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	tagsWithNotesInfo: TagWithNotesInfo[];
	onOpenEditTagsModal: () => void;
} & Partial<NoteData>; // use Partial to make NoteData optional

export function NoteForm({
	options,
	defaultOptions,
	onSubmit,
	onAddTag,
	tagsWithNotesInfo,
	onOpenEditTagsModal,
	title = "",
	body = "",
	tags = [],
}: NoteFormProps) {
	const titleRef = useRef<HTMLInputElement>(null);
	const bodyRef = useRef<HTMLTextAreaElement>(null);
	const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
	const [noteFormTitle, setNoteFormTitle] = useState(title);
	const [noteTitleIsEdited, setNoteTitleIsEdited] = useState(false);
	const [noteTitleIsFocused, setNoteTitleIsFocused] = useState(false);
	const [noteTagInput, setNoteTagInput] = useState("");
	const [formValidated, setFormValidated] = useState(false);

	const maxNoteTitleLength = options.maxNoteTitleLength
		? options.maxNoteTitleLength
		: defaultOptions.maxNoteTitleLength; //use default when undefined
	let remainingNoteTitleLength = maxNoteTitleLength - noteFormTitle.length;
	const maxTagLabelLength = options.maxTagLabelLength
		? options.maxTagLabelLength
		: defaultOptions.maxTagLabelLength; //use default when undefined

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

	//both for displaying Bootstrap <Tooltip>
	const tagsCreatableRef = useRef(null);
	const [showTagsCreatableTooltip, setShowTagsCreatableTooltip] =
		useState(false);

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

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault(); //this is needed for both when the form is invalid and valid

		//the following condition check and actions are needed when the "noValidate" prop is set on <Form>
		if (event.currentTarget.checkValidity() === false) {
			event.stopPropagation();
			setFormValidated(true);
		} else {
			onSubmit({
				title: titleRef.current!.value, //this value can't be null because it's required (as specified in the <Form.Control/> component), hence the non-null type assertion
				body: bodyRef.current ? bodyRef.current.value : "", //send an empty string if it's null
				tags: selectedTags,
			});
			navigateBack();
		}
	}

	return (
		<>
			<Form
				onSubmit={handleSubmit}
				noValidate /* The "noValidate" prop can disable the default validation UI (which is inconsistent across different browsers), 
				but it will also disable the browser's behavior that prevents invalid form submission (which is okay if the submission is handled manually or if a form library (e.g. Formik) is used) */
			>
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
							<Form.Group
								controlId="title"
								className={`${
									formValidated
										? "was-validated" /* the "was-validated" class name is equivalent to setting the "validated" prop on <Form>, this only affects validation styles */
										: ""
								}`}
							>
								<Form.Label>Title</Form.Label>
								<Form.Control
									ref={titleRef}
									required
									value={noteFormTitle}
									onChange={(e) => {
										setNoteFormTitle(e.target.value);
										setNoteTitleIsEdited(true);
									}}
									onFocus={() => setNoteTitleIsFocused(true)}
									onBlur={() => setNoteTitleIsFocused(false)}
									maxLength={maxNoteTitleLength} //browser may use maxLength to validate the form, but only after user has edited this input (tested on Chrome and Firefox)
									aria-describedby="titleInputHelp"
									isInvalid={
										remainingNoteTitleLength < 0 &&
										noteTitleIsEdited /* the maxLength validation only works after the user has edited the input */
									}
								/>
								<Form.Text
									id="titleInputHelp"
									className={`${
										formValidated && noteFormTitle.length === 0
											? "text-danger"
											: remainingNoteTitleLength < 0
											? noteTitleIsEdited
												? "text-danger"
												: "text-warning"
											: "text-muted"
									}`}
								>
									{formValidated && noteFormTitle.length === 0
										? "Note title can't be empty"
										: remainingNoteTitleLength > 0
										? noteTitleIsFocused && //short-circuiting
										  `You can enter ${remainingNoteTitleLength} more
									character(s)`
										: remainingNoteTitleLength === 0
										? noteTitleIsFocused && //short-circuiting
										  `You have reached the max set limit of characters`
										: remainingNoteTitleLength < 0
										? noteTitleIsEdited
											? `Your title is longer than the set limit by ${-remainingNoteTitleLength} character(s)`
											: `Your title is longer than your reduced limit (consider either shortening the title or increasing the limit)`
										: `Did you set a characters limit?`}
								</Form.Text>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group controlId="tags">
								<Form.Label>Tags</Form.Label>
								<InputGroup>
									<Col
										ref={tagsCreatableRef}
										/* Use <Col> to wrap <CreatableReactSelect> in order to properly display the Bootstrap <Tooltip> */
										style={{
											minWidth: 0 /* set this on the parent element of the react-select component, to indicate it's okay to shrink, 
											and this fixes the issue that when having very long input or tags, the react-select component will expand past the expected width */,
										}}
									>
										<CreatableReactSelect
											inputValue={noteTagInput}
											onInputChange={(newValue) => {
												setNoteTagInput(newValue);
											}}
											isValidNewOption={
												(
													inputValue,
													_value /* prefixing underscore indicates unused argument */,
													reactSelectOptions
												) =>
													inputValue.length > 0 &&
													inputValue.length <= maxTagLabelLength &&
													reactSelectOptions.every(
														(reactSelectOption) =>
															reactSelectOption.label !== inputValue
													) //make sure the input value doesn't already exist in react-select options
											} //this prop determines whether the element to create a new tag (i.e. option) will be displayed
											formatCreateLabel={(inputValue) => (
												<>
													<strong>
														<span className="text-success">Create</span> new
														tag: <br />
														<span>"{inputValue}"</span>
													</strong>
													<br />
													<span>
														(
														{maxTagLabelLength - inputValue.length > 0
															? `You can enter ${
																	maxTagLabelLength - inputValue.length
															  } more character(s)`
															: `You can't enter any more characters for creating a new tag`}
														)
													</span>
												</>
											)}
											createOptionPosition={"first"} //Sets the position of the element (for creating a new option) in your options list. Defaults to "last"
											onCreateOption={(label) => {
												const newTag = { id: uuidV4(), label };
												onAddTag(newTag);
												//automatically add new tag to the currently selected tags by default
												setSelectedTags((prev) => [...prev, newTag]);
											}} /* onCreateOption is fired when user creates a new tag, label is the input that the user typed in */
											value={selectedTags.map((tag) => {
												//CreatableReactSelect expects a label and an id
												return { label: tag.label, value: tag.id };
											})} //value is all the options selected, it's NOT the input value
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
											}} /* when user creates a new tag, it does not fire onChange, instead it fires onCreateOption */
											onFocus={() => {
												setShowTagsCreatableTooltip(true);
											}}
											onBlur={() => {
												setShowTagsCreatableTooltip(false);
											}}
											isMulti
											inputId="tags" //matches controlId from parent component <Form.Group>
											className="" //use "flex-fill" to grow to match the remaining width (not mandatory if the component is already wrapped by <Col>)
											placeholder="Add tags"
											noOptionsMessage={(userinput) =>
												userinput.inputValue === ""
													? `No selectable tags, start typing to add a new one`
													: selectedTags.some(
															(selectedTag) =>
																selectedTag.label === userinput.inputValue
													  ) //check if the input matches any of the already-selected tags
													? `The tag "${userinput.inputValue}" has already been added`
													: `Your input is longer than the set limit by ${
															userinput.inputValue.length - maxTagLabelLength
													  } character(s) for creating a new tag, and no tags were found from your search: "${
															userinput.inputValue
													  }"`
											}
											styles={{
												control: (baseStyles) => ({
													...baseStyles,
													//remove rounded corners on right side to align with the button better
													borderTopRightRadius: 0,
													borderBottomRightRadius: 0,
												}),
												menu: (baseStyles) => ({
													...baseStyles,
													overflowWrap: "anywhere", //do this to prevent dropdown menu horizontal scroll on very-long single word
												}),
											}}
										/>
									</Col>
									<Button
										onClick={() => onOpenEditTagsModal()}
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
			<Overlay //fundamental component for positioning and controlling <Tooltip> visibility
				target={tagsCreatableRef.current}
				show={
					showTagsCreatableTooltip &&
					(options.hideTooltips === false ||
						(options.hideTooltips === undefined &&
							defaultOptions.hideTooltips === false)) &&
					noteTagInput.length === 0 //show the tooltip only if the user hasn't typed anything
				}
				placement="top"
			>
				{
					//passing injected props from <Overlay> directly to the <Tooltip> component
					(props) => (
						<Tooltip id="tags-creatable-overlay" {...props}>
							create your new tag here if it doesn't exist in the list yet.
						</Tooltip>
					)
				}
			</Overlay>
		</>
	);
}
