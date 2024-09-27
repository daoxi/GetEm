import { Row, Col, Button, Form } from "react-bootstrap";
import { TagWithNoteInfo } from "../App";

type TagEditItemProps = {
	tag: TagWithNoteInfo;
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
};

export function TagEditItem({
	tag,
	onUpdateTag,
	onDeleteTag,
}: TagEditItemProps) {
	return (
		<Row key={tag.id}>
			<Col>
				<Form.Control
					type="text"
					value={tag.label}
					onChange={(e) => onUpdateTag(tag.id, e.target.value)}
					className={
						"" + (tag.isUsedByNotes ? "border-secondary" : "border-warning")
					} //use warning border for tags not being used by any note
				/>
			</Col>
			<Col xs="auto">
				<Button onClick={() => onDeleteTag(tag.id)} variant="outline-danger">
					✕
				</Button>
			</Col>
		</Row>
	);
}
