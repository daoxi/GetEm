import { Row, Col, Button, Form } from "react-bootstrap";
import { TagWithNoteInfo } from "../App";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TagEditItemProps = {
	tagWithNotesInfo: TagWithNoteInfo;
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
};

export function SortableTagEditItem({
	tagWithNotesInfo,
	onUpdateTag,
	onDeleteTag,
}: TagEditItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: tagWithNotesInfo.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<Row
			key={tagWithNotesInfo.id}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
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
