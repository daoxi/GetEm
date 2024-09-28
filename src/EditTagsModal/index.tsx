import { Tag, TagWithNoteInfo } from "../App";
import { Stack, Form, Modal, Alert } from "react-bootstrap";
import { SortableTagEditItem } from "./SortableTagEditItem";

import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type EditTagsModalProps = {
	show: boolean;
	handleClose: () => void;
	tagsWithNotesInfo: TagWithNoteInfo[];
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
	setTags: (newTags: Tag[] | ((newTags: Tag[]) => Tag[])) => void;
};

export function EditTagsModal({
	show,
	handleClose,
	tagsWithNotesInfo,
	onUpdateTag,
	onDeleteTag,
	setTags,
}: EditTagsModalProps) {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over === null) {
			//stop here if it's null
			return;
		} else if (active.id !== over.id) {
			//instead of setting tagsWithNotesInfo directly, use setTags to set "tags" state in the parent component, which will cause update to tagsWithNotesInfo accordingly
			setTags((prevTags) => {
				const oldIndex = prevTags.findIndex(
					(prevTag) => prevTag.id === active.id.toString()
				);
				const newIndex = prevTags.findIndex(
					(prevTag) => prevTag.id === over!.id.toString() //using non-null type assertion here because it's already been checked to not be null
				);
				return arrayMove(prevTags, oldIndex, newIndex);
			});
		}
	};

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Edit All Tags</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={tagsWithNotesInfo}
							strategy={verticalListSortingStrategy}
						>
							<Stack gap={2}>
								{tagsWithNotesInfo.map((tagWithNotesInfo) => (
									<SortableTagEditItem
										key={tagWithNotesInfo.id}
										tagWithNotesInfo={tagWithNotesInfo}
										onUpdateTag={onUpdateTag}
										onDeleteTag={onDeleteTag}
									/>
								))}
							</Stack>
						</SortableContext>
					</DndContext>
				</Form>
				{tagsWithNotesInfo.length === 0 ? (
					<Alert variant="danger">You haven't added any tags yet.</Alert>
				) : (
					<Stack gap={0.3} className="mt-3">
						<h6>Please Note:</h6>
						<p>
							Editing a tag affects <strong>all</strong> notes that use the tag.
						</p>
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
