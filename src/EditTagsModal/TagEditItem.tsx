import { forwardRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { TagWithNoteInfo } from "../App";

type TagEditItemProps = {
	tagWithNotesInfo: TagWithNoteInfo;
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
	id: string;
	[propName: string]: any; //use this to represent all remaining props of any type
};

export const TagEditItem = forwardRef(
	(
		{
			tagWithNotesInfo,
			onUpdateTag,
			onDeleteTag,
			id,
			...props
		}: TagEditItemProps,
		ref
	) => {
		return (
			<Row
				{...props}
				ref={ref}
				/* the following attributes are referenced from the dnd-kit web-documentation "Sortable" template */
			>
				<Col>
					<Form.Control
						type="text"
						value={tagWithNotesInfo.label}
						onChange={(e) => onUpdateTag(tagWithNotesInfo.id, e.target.value)}
						className={
							"" +
							(tagWithNotesInfo.isUsedByNotes
								? "border-secondary"
								: "border-warning")
						} //use warning border for tags not being used by any note
					/>
				</Col>
				<Col xs="auto">
					<Button
						onClick={() => onDeleteTag(tagWithNotesInfo.id)}
						variant="outline-danger"
					>
						✕
					</Button>
				</Col>
			</Row>
		);
	}
);
