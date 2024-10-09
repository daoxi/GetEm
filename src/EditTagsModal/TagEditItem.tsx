//Icon imports start
import { LuArrowUpDown } from "react-icons/lu";
import { FaSave } from "react-icons/fa";
//Icon imports end
import { forwardRef, useState } from "react";
import {
	Button,
	Col,
	Container,
	Form,
	InputGroup,
	Row,
	Stack,
} from "react-bootstrap";
import { TagInputWithStatus } from ".";
import styles from "./TagEditItem.module.scss";

type TagEditItemProps = {
	tagInputWithStatus: TagInputWithStatus;
} & Partial<TagEditItemPropsOptional>;

type TagEditItemPropsOptional = {
	//below are not needed when using this component inside <DragOverlay> as visual element
	maxtagInputLength: number;
	onUpdateTagInput: (id: string, label: string) => void;
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
	//"below" end

	isBeingDragged: boolean;
	[propName: string]: any; //use this to represent all remaining props of any type
};

export const TagEditItem = forwardRef(
	(
		{
			tagInputWithStatus,
			maxtagInputLength,
			onUpdateTagInput,
			onUpdateTag,
			onDeleteTag,
			isBeingDragged,
			...props
		}: TagEditItemProps,
		ref
	) => {
		const [isFocused, setIsFocused] = useState(false); //this is for the tag input field

		const isBeingDraggedClassName = isBeingDragged ? "invisible" : "";

		//this is for the tag input field border
		let borderClassName = "";
		if (tagInputWithStatus.status === "unknown") {
			borderClassName = "border-info";
		} else if (
			tagInputWithStatus.status === "empty" ||
			tagInputWithStatus.status === "overlong" ||
			tagInputWithStatus.status === "duplicate"
		) {
			borderClassName = "border-danger";
		} else if (tagInputWithStatus.status === "unsaved") {
			borderClassName = "border-warning";
		} else if (tagInputWithStatus.status === "good") {
			borderClassName = "border-success";
		} else {
			borderClassName = "border-secondary";
		}

		return (
			<Container>
				<Row ref={ref} style={props.style}>
					<Col>
						<InputGroup /* The hasValidation prop can make the second-last element in <InputGroup> has rounded-corners on the right side (useful for <Form.Control.Feedback>) */
						>
							<InputGroup.Text
								variant="outline-secondary"
								{...props.attributes}
								{...props.listeners}
								className={
									isBeingDragged
										? `${styles["draggable-handle-icon-active"]}`
										: `${styles["draggable-handle-icon"]}`
								}
							>
								<LuArrowUpDown />
							</InputGroup.Text>
							<Form.Control
								type="text"
								placeholder="Tag label"
								value={tagInputWithStatus.label}
								isInvalid={borderClassName === "border-danger"}
								className={"" + borderClassName}
								maxLength={maxtagInputLength}
								aria-describedby="tagInputTips"
								onChange={
									(e) =>
										onUpdateTagInput &&
										onUpdateTagInput(tagInputWithStatus.id, e.target.value) //used short-circuiting to first check the onUpdateTagInput is not undefined (because onUpdateTagInput is an optional prop)
								}
								onFocus={() => {
									setIsFocused(true);
								}}
								onBlur={() => {
									setIsFocused(false);
								}}
							/>
							<Button
								variant={
									tagInputWithStatus.status === "unsaved"
										? "primary"
										: "outline-secondary"
								}
								disabled={!(tagInputWithStatus.status === "unsaved")}
								onClick={
									() =>
										onUpdateTag &&
										onUpdateTag(tagInputWithStatus.id, tagInputWithStatus.label) //used short-circuiting to first check the onUpdateTag is not undefined (because onUpdateTag is an optional prop)
								}
							>
								<FaSave />
							</Button>
						</InputGroup>
						<Form.Text id="tagInputTips">
							{tagInputWithStatus.status === "empty" ? (
								<span className="text-danger">Tag label can't be empty.</span>
							) : tagInputWithStatus.status === "overlong" ? (
								<span className="text-danger">The tag label is too long.</span>
							) : tagInputWithStatus.status === "duplicate" ? (
								<span className="text-danger">
									Duplicate tag labels are not allowed.
								</span>
							) : isFocused === true ? (
								maxtagInputLength &&
								/* short-circuiting to check if it's undefined first */ tagInputWithStatus
									.label.length < maxtagInputLength ? (
									<span className="text-muted">
										You can enter{" "}
										{maxtagInputLength - tagInputWithStatus.label.length} more
										characters.
									</span>
								) : tagInputWithStatus.label.length === maxtagInputLength ? (
									<span className="text-muted">
										You have entered the maximum number of characters.
									</span>
								) : (
									<span>You have entered too many characters (which shouldn't be possible).</span>
								)
							) : (
								<span></span>
							)}
						</Form.Text>
					</Col>

					<Col xs="auto" className={isBeingDraggedClassName}>
						<Stack direction="horizontal" gap={2}>
							<Button
								variant={
									tagInputWithStatus.isUsedByNotes
										? "outline-danger"
										: "outline-warning"
								}
								onClick={
									() => onDeleteTag && onDeleteTag(tagInputWithStatus.id) //used short-circuiting to first check the onDeleteTag is not undefined (because onDeleteTag is an optional prop)
								}
							>
								✕
							</Button>
						</Stack>
					</Col>
				</Row>
			</Container>
		);
	}
);
