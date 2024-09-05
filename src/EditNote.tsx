import { NoteData, Tag } from "./App";
import { NoteForm } from "./NoteForm";
import { useNote } from "./NoteLayout";

type EditNoteProps = {
	//similar to NoteForm
	onSubmit: (id: string, data: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	availableTags: Tag[];
};

export function EditNote({ onSubmit, onAddTag, availableTags }: EditNoteProps) {
	const note = useNote();
	return (
		<>
			<h1 className="mb-4">Edit Note</h1>
			<NoteForm
				onSubmit={(data) => onSubmit(note.id, data)}
				/* can't just pass props in as "onSubmit={onSubmit}", due to different props type in EditNote and NoteForm */
				onAddTag={onAddTag}
				availableTags={availableTags}
			/>
		</>
	);
}
