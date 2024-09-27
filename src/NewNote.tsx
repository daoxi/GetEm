import { NoteData, Tag, TagWithNoteInfo } from "./App";
import { NoteForm } from "./NoteForm";

type NewNoteProps = {
	//same as NoteForm
	onSubmit: (data: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
	tagsWithNotesInfo: TagWithNoteInfo[];
};

export function NewNote({
	onSubmit,
	onAddTag,
	onUpdateTag,
	onDeleteTag,
	tagsWithNotesInfo,
}: NewNoteProps) {
	return (
		<>
			<h1 className="mb-4">New Note</h1>
			<NoteForm
				onSubmit={onSubmit}
				onAddTag={onAddTag}
				onUpdateTag={onUpdateTag}
				onDeleteTag={onDeleteTag}
				tagsWithNotesInfo={tagsWithNotesInfo}
			/>
		</>
	);
}
