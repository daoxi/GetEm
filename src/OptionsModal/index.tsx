import { Form, Modal } from "react-bootstrap";
import { Options } from "../App";
import { OptionsRangeSlider } from "../OptionsRangeSlider";

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
				<OptionsRangeSlider
					options={options}
					onUpdateOptions={onUpdateOptions}
					optionName="maxNoteTitleLength"
					defaultValue={80} //options.maxNoteTitleLength is assumed to be 80 when undefined
					minValue={50}
					maxValue={100}
					textBeforeNumber="Max note title length: "
					textAfterNumber=" (this won't trim existing titles longer than the limit)"
				/>
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
