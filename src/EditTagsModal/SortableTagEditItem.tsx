//The following imports are referenced from the dnd-kit web-documentation "Sortable" template
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TagEditItem } from "./TagEditItem";
import { TagInputWithStatus } from ".";

type SortableTagEditItemProps = {
	tagInputWithStatus: TagInputWithStatus;
	maxtagInputLength: number;
	onUpdateTagInput: (id: string, label: string) => void;
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
};

export function SortableTagEditItem({
	tagInputWithStatus,
	maxtagInputLength,
	onUpdateTagInput,
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
	} = useSortable({ id: tagInputWithStatus.id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.2 : 1, //make the tag's position display element semi-transparent while that tag is being dragged
	};

	return (
		<TagEditItem
			tagInputWithStatus={tagInputWithStatus}
			maxtagInputLength={maxtagInputLength}
			onUpdateTagInput={onUpdateTagInput}
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
