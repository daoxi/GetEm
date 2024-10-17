import { Form, Modal } from "react-bootstrap";
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
			<Modal.Body>
				<Form>
					<Form.Check
						type={`checkbox`}
						id={`options-toggle-hideDemoPerm`}
						label={`Never show demo reminder`}
						checked={options.hideDemoPerm || false} //the "checked" prop can't be undefined (hence the "|| false" to fix this), or else this input will initially be considered uncontrolled by React
						onChange={(e) => {
							onUpdateOptions("hideDemoPerm", e.target.checked);
						}}
					/>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
