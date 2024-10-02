import { forwardRef } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { TagWithNoteInfo } from "../App";
import styles from "./TagEditItem.module.css";
import { LuArrowUpDown } from "react-icons/lu";

type TagEditItemProps = {
	tagWithNotesInfo: TagWithNoteInfo;
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
} & Partial<TagEditItemPropsOptional>;

type TagEditItemPropsOptional = {
	isBeingDragged: boolean;
	[propName: string]: any; //use this to represent all remaining props of any type
};

export const TagEditItem = forwardRef(
	(
		{
			tagWithNotesInfo,
			onUpdateTag,
			onDeleteTag,
			isBeingDragged,
			...props
		}: TagEditItemProps,
		ref
	) => {
		const isBeingDraggedClassName = isBeingDragged ? "invisible" : "";
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
								value={tagWithNotesInfo.label}
								onChange={(e) =>
									onUpdateTag(tagWithNotesInfo.id, e.target.value)
								}
								className={
									"" +
									(tagWithNotesInfo.isUsedByNotes
										? "border-secondary"
										: "border-warning")
								} //use warning border for tags not being used by any note
							/>
						</InputGroup>
					</Col>
					<Col xs="auto" className={isBeingDraggedClassName}>
						<Button
							onClick={() => onDeleteTag(tagWithNotesInfo.id)}
							variant="outline-danger"
						>
							✕
						</Button>
					</Col>
				</Row>
			</Container>
		);
	}
);
