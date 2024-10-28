import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type DeleteConfirmModalProps = {
	show: boolean;
	handleCloseModal: () => void;
	id: string;
	onDeleteNote: (id: string) => void;
};

export function DeleteConfirmModal({
	show,
	handleCloseModal,
	id,
	onDeleteNote,
}: DeleteConfirmModalProps) {
	const navigate = useNavigate();

	return (
		<Modal show={show} onHide={handleCloseModal}>
			<Modal.Header closeButton>
				<Modal.Title>Please Confirm</Modal.Title>
			</Modal.Header>
			<Modal.Body>Are you sure about deleting this note?</Modal.Body>
			<Modal.Footer>
				<Button
					variant="danger"
					onClick={() => {
						handleCloseModal();
						navigate("/");
						onDeleteNote(id);
					}}
				>
					Delete
				</Button>
				<Button variant="outline-secondary" onClick={handleCloseModal}>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
