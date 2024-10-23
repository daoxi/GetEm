import { NoteData, Options, Tag, TagWithNotesInfo } from "./App";
import { NoteForm } from "./NoteForm";

type NewNoteProps = {
	//same as NoteForm
	options: Options;
	onSubmit: (data: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	tagsWithNotesInfo: TagWithNotesInfo[];
	setEditTagsModalIsOpen: (newEditTagsModalIsOpen: boolean) => void;
};

export function NewNote({
	options,
	onSubmit,
	onAddTag,
	tagsWithNotesInfo,
	setEditTagsModalIsOpen,
}: NewNoteProps) {
	return (
		<>
			<h1 className="mb-4">New Note</h1>
			<NoteForm
				options={options}
				onSubmit={onSubmit}
				onAddTag={onAddTag}
				tagsWithNotesInfo={tagsWithNotesInfo}
				setEditTagsModalIsOpen={setEditTagsModalIsOpen}
			/>
		</>
	);
}
