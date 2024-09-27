import { Note, Tag } from "./App";
import { Row, Col, Stack, Button, Form, Modal, Alert } from "react-bootstrap";

type EditTagsModalProps = {
	show: boolean;
	handleClose: () => void;
	availableTags: Tag[];
	notes: Note[];
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
};

export function EditTagsModal({
	show,
	handleClose,
	availableTags,
	notes,
	onUpdateTag,
	onDeleteTag,
}: EditTagsModalProps) {
	const availableTagsWithNotesInfo = availableTags.map((tag) => {
		if (
			notes.some((note) => note.tags.some((notetag) => notetag.id === tag.id))
		) {
			return { ...tag, isUsedByNotes: true };
		} else {
			return { ...tag, isUsedByNotes: false };
		}
	}); //this new array of tags has an additional boolean property to track whether the tag belongs to any note(s)

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Edit All Tags</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Stack gap={2}>
						{availableTagsWithNotesInfo.map((tag) => (
							<Row key={tag.id}>
								<Col>
									<Form.Control
										type="text"
										value={tag.label}
										onChange={(e) => onUpdateTag(tag.id, e.target.value)}
										className={
											"" +
											(tag.isUsedByNotes
												? "border-secondary"
												: "border-warning")
										} //use warning border for tags not being used by any note
									/>
								</Col>
								<Col xs="auto">
									<Button
										onClick={() => onDeleteTag(tag.id)}
										variant="outline-danger"
									>
										✕
									</Button>
								</Col>
							</Row>
						))}
					</Stack>
				</Form>
				{availableTagsWithNotesInfo.length === 0 ? (
					<Alert variant="danger">You haven't added any tags yet.</Alert>
				) : (
					<p className="mt-3">
						<span>( </span>
						<span className="border rounded border-warning py-1 px-2">
							Warning border
						</span>
						<span>
							{" "}
							(if any) indicates the tag is not currently being used by any
							note.{" "}
						</span>
						<span>Tags with the same name (duplicates) are not allowed. )</span>
					</p>
				)}
			</Modal.Body>
		</Modal>
	);
}
