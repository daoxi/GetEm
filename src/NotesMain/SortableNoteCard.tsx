import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { NoteCard } from "./NoteCard";
import { Note } from "../App";

type SortableNoteCardProps = {} & Note;

export function SortableNoteCard({
	id,
	title,
	body,
	tags,
}: SortableNoteCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<NoteCard
			id={id}
			title={title}
			body={body}
			tags={tags}
			/* the following attributes are partially referenced from the dnd-kit web-documentation "Sortable" template */
			ref={setNodeRef}
			style={style}
			attributes={{ ...attributes }}
			listeners={{ ...listeners }}
		/>
	);
}
