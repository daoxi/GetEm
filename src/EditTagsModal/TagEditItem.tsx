//Icon imports start
import { LuArrowUpDown } from "react-icons/lu";
//Icon imports end
import { forwardRef } from "react";
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
	//the "on*" events below are not needed when using this component inside <DragOverlay> as visual element
	onUpdateTagInput: (id: string, label: string) => void;
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;

	isBeingDragged: boolean;
	[propName: string]: any; //use this to represent all remaining props of any type
};

export const TagEditItem = forwardRef(
	(
		{
			tagInputWithStatus,
			onUpdateTagInput,
			onUpdateTag,
			onDeleteTag,
			isBeingDragged,
			...props
		}: TagEditItemProps,
		ref
	) => {
		const isBeingDraggedClassName = isBeingDragged ? "invisible" : "";

		let borderClassName = "";
		if (tagInputWithStatus.status === "unknown") {
			borderClassName = "border-info";
		} else if (
			tagInputWithStatus.status === "empty" ||
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
						<InputGroup>
							<InputGroup.Text
								variant="outline-secondary"
								{...props.attributes}
								{...props.listeners}
								className={
									isBeingDragged
										? `${styles.grabbableHandleIconActive}`
										: `${styles.grabbableHandleIcon}`
								}
							>
								<LuArrowUpDown />
							</InputGroup.Text>
							<Form.Control
								type="text"
								value={tagInputWithStatus.label}
								onChange={
									(e) =>
										onUpdateTagInput &&
										onUpdateTagInput(tagInputWithStatus.id, e.target.value) //used short-circuiting to first check the onUpdateTagInput is not undefined (because onUpdateTagInput is an optional prop)
								}
								className={"" + borderClassName}
							/>
						</InputGroup>
					</Col>
					<Col xs="auto" className={isBeingDraggedClassName}>
						<Stack direction="horizontal" gap={2}>
							<Button
								variant={
									tagInputWithStatus.status === "unsaved"
										? "outline-primary"
										: "outline-secondary"
								}
								disabled={!(tagInputWithStatus.status === "unsaved")}
								onClick={
									() =>
										onUpdateTag &&
										onUpdateTag(tagInputWithStatus.id, tagInputWithStatus.label) //used short-circuiting to first check the onUpdateTag is not undefined (because onUpdateTag is an optional prop)
								}
							>
								🖫
							</Button>
							<Button
								variant={
									tagInputWithStatus.isUsedByNotes
										? "outline-danger"
										: "outline-warning"
								}
								onClick={
									() => onDeleteTag && onDeleteTag(tagInputWithStatus.id) //used short-circuiting to first check the onDeleteTag is not undefined (because onDeleteTag is an optional prop)
								}
								/*
								className={
									"" +
									(tagInputWithStatus.isUsedByNotes
										? "border-secondary"
										: "border-warning")
								} //use warning border for tags not being used by any note
								*/
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
