import { TagWithNoteInfo } from "./App";
import { Row, Col, Stack, Button, Form, Modal, Alert } from "react-bootstrap";

type EditTagsModalProps = {
	show: boolean;
	handleClose: () => void;
	tagsWithNotesInfo: TagWithNoteInfo[];
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
};

export function EditTagsModal({
	show,
	handleClose,
	tagsWithNotesInfo,
	onUpdateTag,
	onDeleteTag,
}: EditTagsModalProps) {
	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Edit All Tags</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Stack gap={2}>
						{tagsWithNotesInfo.map((tag) => (
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
				{tagsWithNotesInfo.length === 0 ? (
					<Alert variant="danger">You haven't added any tags yet.</Alert>
				) : (
					<Stack gap={0.3} className="mt-3">
						<h6>Please Note:</h6>
						<p>Editing a tag affects <strong>all</strong> notes that use the tag.</p>
						<p>
							<span className="border rounded border-warning py-1 px-2">
								Warning border
							</span>
							<span>
								{" "}
								(if any) indicates the tag is not currently being used by any
								note.
							</span>
						</p>
						<p>Tags with the same name (duplicates) are not allowed.</p>
					</Stack>
				)}
			</Modal.Body>
		</Modal>
	);
}
