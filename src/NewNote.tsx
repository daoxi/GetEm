import { NoteData, Tag, TagWithNoteInfo } from "./App";
import { NoteForm } from "./NoteForm";

type NewNoteProps = {
	//same as NoteForm
	onSubmit: (data: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	tagsWithNotesInfo: TagWithNoteInfo[];
	setEditTagsModalIsOpen: (newEditTagsModalIsOpen: boolean) => void;
};

export function NewNote({
	onSubmit,
	onAddTag,
	tagsWithNotesInfo,
	setEditTagsModalIsOpen,
}: NewNoteProps) {
	return (
		<>
			<h1 className="mb-4">New Note</h1>
			<NoteForm
				onSubmit={onSubmit}
				onAddTag={onAddTag}
				tagsWithNotesInfo={tagsWithNotesInfo}
				setEditTagsModalIsOpen={setEditTagsModalIsOpen}
			/>
		</>
	);
}
