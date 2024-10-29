import { NoteData, Options, Tag, TagWithNotesInfo } from "./App";
import { NoteForm } from "./NoteForm";

type NewNoteProps = {
	//same as NoteForm
	options: Options;
	defaultOptions: Options;
	onSubmit: (data: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	tagsWithNotesInfo: TagWithNotesInfo[];
	onOpenEditTagsModal: () => void;
};

export function NewNote({
	options,
	defaultOptions,
	onSubmit,
	onAddTag,
	tagsWithNotesInfo,
	onOpenEditTagsModal,
}: NewNoteProps) {
	return (
		<>
			<h1 className="mb-4">New Note</h1>
			<NoteForm
				options={options}
				defaultOptions={defaultOptions}
				onSubmit={onSubmit}
				onAddTag={onAddTag}
				tagsWithNotesInfo={tagsWithNotesInfo}
				onOpenEditTagsModal={onOpenEditTagsModal}
			/>
		</>
	);
}
