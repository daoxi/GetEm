import { NoteData, Tag, TagWithNoteInfo } from "./App";
import { NoteForm } from "./NoteForm";
import { useNote } from "./NoteLayout";

type EditNoteProps = {
	//similar to NoteForm
	onSubmit: (id: string, data: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	tagsWithNotesInfo: TagWithNoteInfo[];
};

export function EditNote({ onSubmit, onAddTag, tagsWithNotesInfo }: EditNoteProps) {
	const note = useNote();
	return (
		<>
			<h1 className="mb-4">Edit Note</h1>
			<NoteForm
				title={note.title}
				body={note.body}
				tags={note.tags}
				onSubmit={(data) => onSubmit(note.id, data)}
				/* can't just pass props in as "onSubmit={onSubmit}", due to different props type in EditNote and NoteForm */
				onAddTag={onAddTag}
				tagsWithNotesInfo={tagsWithNotesInfo}
			/>
		</>
	);
}
