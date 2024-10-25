//The following imports are referenced from the dnd-kit web-documentation "Sortable" template
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
//"The following" ends

import { TagEditItem } from "./TagEditItem";
import { TagInputWithStatus } from ".";

type SortableTagEditItemProps = {
	tagInputWithStatus: TagInputWithStatus;
	maxTagLabelLength: number;
	onUpdateTagInput: (id: string, label: string) => void;
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
};

export function SortableTagEditItem({
	tagInputWithStatus,
	maxTagLabelLength,
	onUpdateTagInput,
	onUpdateTag,
	onDeleteTag,
}: SortableTagEditItemProps) {
	//The following declarations are partially referenced from the dnd-kit web-documentation "Sortable" template
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: tagInputWithStatus.id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.2 : 1, //make the tag's position display element semi-transparent while that tag is being dragged
	};
	//"The following" ends

	return (
		<TagEditItem
			tagInputWithStatus={tagInputWithStatus}
			maxTagLabelLength={maxTagLabelLength}
			onUpdateTagInput={onUpdateTagInput}
			onUpdateTag={onUpdateTag}
			onDeleteTag={onDeleteTag}
			/* the following attributes are partially referenced from the dnd-kit web-documentation "Sortable" template */
			ref={setNodeRef}
			style={style}
			attributes={{ ...attributes }}
			listeners={{ ...listeners }}
		></TagEditItem>
	);
}
