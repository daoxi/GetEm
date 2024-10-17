import { Modal } from "react-bootstrap";
import { Options } from "../App";

type OptionsModalProps = {
	show: boolean;
	handleClose: () => void;
	options: Options;
	onUpdateOptions: (optionName: string, newValue: any) => void;
};

export function OptionsModal({
	show,
	handleClose,
	options,
	onUpdateOptions,
}: OptionsModalProps) {
	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Options</Modal.Title>
			</Modal.Header>
			<Modal.Body>Body here</Modal.Body>
		</Modal>
	);
}
