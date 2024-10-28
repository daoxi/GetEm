import { NoteData, Options, Tag, TagWithNotesInfo } from "./App";
import { NoteForm } from "./NoteForm";
import { useNote } from "./NoteOutlet";

type EditNoteProps = {
	//similar to NoteForm
	options: Options;
	onSubmit: (id: string, data: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	tagsWithNotesInfo: TagWithNotesInfo[];
	onOpenEditTagsModal: () => void;
};

export function EditNote({
	options,
	onSubmit,
	onAddTag,
	tagsWithNotesInfo,
	onOpenEditTagsModal,
}: EditNoteProps) {
	const note = useNote();
	return (
		<>
			<h1 className="mb-4">Edit Note</h1>
			<NoteForm
				options={options}
				title={note.title}
				body={note.body}
				tags={note.tags}
				onSubmit={(data) => onSubmit(note.id, data)}
				/* can't just pass props in as "onSubmit={onSubmit}", due to different props type in EditNote and NoteForm */
				onAddTag={onAddTag}
				tagsWithNotesInfo={tagsWithNotesInfo}
				onOpenEditTagsModal={onOpenEditTagsModal}
			/>
		</>
	);
}
