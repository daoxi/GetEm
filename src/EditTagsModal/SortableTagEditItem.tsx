//The following imports are referenced from the dnd-kit web-documentation "Sortable" template
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TagEditItem } from "./TagEditItem";
import { TagWithNoteInfo } from "../App";

type SortableTagEditItemProps = {
	tagWithNotesInfo: TagWithNoteInfo;
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
};

export function SortableTagEditItem({
	tagWithNotesInfo,
	onUpdateTag,
	onDeleteTag,
}: SortableTagEditItemProps) {
	//The following declarations are referenced from the dnd-kit web-documentation "Sortable" template
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: tagWithNotesInfo.id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<TagEditItem
			tagWithNotesInfo={tagWithNotesInfo}
			onUpdateTag={onUpdateTag}
			onDeleteTag={onDeleteTag}
			/* the following are for dnd kit */
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		></TagEditItem>
	);
}
