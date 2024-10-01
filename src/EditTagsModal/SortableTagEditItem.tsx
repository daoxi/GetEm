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
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: tagWithNotesInfo.id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.2 : 1, //make the tag's position display element semi-transparent while that tag is being dragged
	};

	return (
		<TagEditItem
			tagWithNotesInfo={tagWithNotesInfo}
			onUpdateTag={onUpdateTag}
			onDeleteTag={onDeleteTag}
			/* the following attributes are referenced from the dnd-kit web-documentation "Sortable" template */
			ref={setNodeRef}
			style={style}
			attributes={{ ...attributes }}
			listeners={{ ...listeners }}
		></TagEditItem>
	);
}
