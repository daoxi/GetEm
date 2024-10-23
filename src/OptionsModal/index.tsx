import { Form, Modal } from "react-bootstrap";
import { Options } from "../App";
import { useState } from "react";

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
	const maxNoteTitleLengthInitial =
		options.maxNoteTitleLength === undefined ? 80 : options.maxNoteTitleLength; //this value is assumed to be 80 when undefined
	const [maxNoteTitleLengthTemp, setMaxNoteTitleLengthTemp] = useState(
		maxNoteTitleLengthInitial
	);

	function handleNoteTitleLengthSlideEnd() {
		if (options.maxNoteTitleLength !== maxNoteTitleLengthTemp) {
			onUpdateOptions("maxNoteTitleLength", maxNoteTitleLengthTemp);
		} else {
			return;
		}
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Options</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<h5>Demo</h5>
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
				<hr />
				<h5>Notes & Tags</h5>
				<Form>
					<Form.Check
						type={`checkbox`}
						id={`options-modal-toggle-deleteNoteRequireConfirm`}
						label={`Require confirmation when deleting a note`}
						checked={
							options.deleteNoteRequireConfirm === undefined
								? true
								: options.deleteNoteRequireConfirm
						} //default value is assumed to be true when undefined
						onChange={(e) => {
							onUpdateOptions("deleteNoteRequireConfirm", e.target.checked);
						}}
					/>
				</Form>
				<Form>
					<Form.Check
						type={`checkbox`}
						id={`options-modal-toggle-tagsOrderAffectNotes`}
						label={`Tags in notes are ordered (i.e. matches tags order in dropdown and modal)`}
						checked={
							options.tagsOrderAffectNotes === undefined
								? true
								: options.tagsOrderAffectNotes
						} //default value is assumed to be true when undefined
						onChange={(e) => {
							onUpdateOptions("tagsOrderAffectNotes", e.target.checked);
						}}
					/>
				</Form>
				<Form>
					<Form.Label>
						Max note title length: <strong>{maxNoteTitleLengthTemp}</strong>{" "}
						(this won't trim existing titles longer than the limit)
					</Form.Label>
					<Form.Range
						min={50}
						max={100}
						value={maxNoteTitleLengthTemp}
						onChange={(e) => {
							setMaxNoteTitleLengthTemp(e.target.value);
						}}
						//The following events are for tracking when the user has finished sliding the range slider,
						//this approach reduces the frequency that the locally-stored options get updated (which could also be useful when the app needs to communicate with the server whenever options are updated)
						onMouseUp={() => {
							handleNoteTitleLengthSlideEnd();
						}} //for mouse drag
						onKeyUp={() => {
							handleNoteTitleLengthSlideEnd();
						}} //for keyboard arrow keys
						onTouchEnd={() => {
							handleNoteTitleLengthSlideEnd();
						}} //for touch devices
						onBlur={() => {
							handleNoteTitleLengthSlideEnd();
						}} //catch the situation(s) when user slided the range slider in an unknown way that doesn't trigger any of the events above
					/>
				</Form>
				<hr />
				<h5>Misc</h5>
				<Form>
					<Form.Check
						type={`checkbox`}
						id={`options-toggle-hideTooltips`}
						label={`Hide tooltips`}
						checked={options.hideTooltips || false} //the "checked" prop can't be undefined (hence the "|| false" to fix this), or else this input will initially be considered uncontrolled by React
						onChange={(e) => {
							onUpdateOptions("hideTooltips", e.target.checked);
						}}
					/>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
