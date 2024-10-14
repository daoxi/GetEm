import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { NoteCard } from "./NoteCard";
import { Note } from "../App";

type SortableNoteCardProps = {
	notesMode: string;
	onDeleteNoteWithConfirm: (id: string) => void;
} & Note;

export function SortableNoteCard({
	notesMode,
	id,
	title,
	body,
	tags,
	onDeleteNoteWithConfirm,
}: SortableNoteCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.2 : 1, //make the note's position display element semi-transparent while that note is being dragged
	};

	return (
		<NoteCard
			notesMode={notesMode}
			id={id}
			title={title}
			body={body}
			tags={tags}
			onDeleteNoteWithConfirm={onDeleteNoteWithConfirm}
			/* the following attributes are partially referenced from the dnd-kit web-documentation "Sortable" template */
			ref={setNodeRef}
			style={style}
			attributes={{ ...attributes }}
			listeners={{ ...listeners }}
		/>
	);
}
