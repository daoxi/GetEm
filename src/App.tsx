import "bootstrap/dist/css/bootstrap.min.css";
//Bootstrap allows styling using className, also contains default styling for most elements, which will be applied to all components
import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { NewNote } from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";
import { useMemo, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { NotesMain } from "./NotesMain";
import { NoteOutlet } from "./NoteOutlet";
import { ViewNote } from "./ViewNote";
import { EditNote } from "./EditNote";
import { Demo } from "./Demo";
import { EditTagsModal } from "./EditTagsModal";

//Raw note data with the id
export type RawNote = {
	id: string;
} & RawNoteData;

//Raw note data without the id
export type RawNoteData = {
	title: string;
	body: string;
	//store only the ids of the tags, so that when tags' label change, there's no need to update each note
	tagIds: string[];
};

//Note data with the id
export type Note = {
	id: string;
} & NoteData;

//Note data without the id
export type NoteData = {
	title: string;
	body: string;
	tags: Tag[];
};

export type Tag = {
	id: string;
	label: string;
};

export type TagWithNotesInfo = {
	isUsedByNotes: boolean;
} & Tag;

function App() {
	const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
	const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

	//convert raw note into actual note with tags (instead of just with ids of tags), and update it whenever there's any change on the notes or tags
	const notesWithTags: Note[] = useMemo(() => {
		return notes.map((note) => {
			//add all the tags (that have matching tag ids) to the raw note
			return {
				...note,
				tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
			};
		});
	}, [notes, tags]);

	//this new array of tags has an additional boolean property to track whether the tag belongs to any note(s)
	const tagsWithNotesInfo: TagWithNotesInfo[] = useMemo(() => {
		return tags.map((tag) => {
			if (notes.some((note) => note.tagIds.some((tagid) => tagid === tag.id))) {
				return { ...tag, isUsedByNotes: true };
			} else {
				return { ...tag, isUsedByNotes: false };
			}
		});
	}, [notes, tags]);

	//tracks whether the modal for editing tags should be open
	const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

	//handles creation of a note
	function onCreateNote({ tags, ...data }: NoteData) {
		setNotes((prevNotes) => {
			//basically converting from NoteData to RawNote
			return [
				...prevNotes,
				{ ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
			];
		});
	}

	//for updating a note, similar to when creating a note
	function onUpdateNote(id: string, { tags, ...data }: NoteData) {
		setNotes((prevNotes) => {
			return prevNotes.map((note) => {
				if (note.id === id) {
					//keeping existing note data ("...note") and overwriting with new note data ("...data"). tagIds conversion is similar to when creating a note
					return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
				} else {
					return note;
				}
			});
		});
	}

	function onDeleteNote(id: string) {
		setNotes((prevNotes) => {
			return prevNotes.filter((note) => note.id !== id); //keeping all notes that are not supposed to be deleted
		});
	}

	function onAddTag(tag: Tag) {
		//console.log("onAddTag: id=" + tag.id + ", label=" + tag.label);
		setTags((prev) => [...prev, tag]);
	}

	/*
	//note that this function doesn't check whether the tags already exist
	function onAddMultipleTags (tags: Tag[]) {
		console.log("onAddMultipleTags");
		setTags((prev) => [...prev, ...tags]);
	}
	*/

	function onUpdateTag(id: string, label: string) {
		setTags((prevTags) => {
			return prevTags.map((tag) => {
				if (tag.id === id) {
					//keeping all existing tag data, except that the label property will be updated to the value of label (from function argument), "label: label" can be written as simply "label"
					return { ...tag, label };
				} else {
					return tag;
				}
			});
		});
	}

	function onDeleteTag(id: string) {
		setTags((prevTags) => {
			onUpdateTag;
			return prevTags.filter((tag) => tag.id !== id); //keeping all notes that are not supposed to be deleted
		});
	}

	return (
		<>
			<Container className="my-4">
				<Routes>
					<Route
						index
						/* this Route is the homepage */
						/* path="/" */
						element={
							<>
								<Demo
									onCreateNote={onCreateNote}
									onAddTag={onAddTag}
									tags={tags}
								/>
								<NotesMain
									notesWithTags={notesWithTags}
									tagsWithNotesInfo={tagsWithNotesInfo}
									setEditTagsModalIsOpen={setEditTagsModalIsOpen}
								/>
							</>
						}
					/>
					<Route
						path="/new"
						element={
							<>
								<NewNote
									onSubmit={onCreateNote}
									onAddTag={onAddTag}
									tagsWithNotesInfo={tagsWithNotesInfo}
									setEditTagsModalIsOpen={setEditTagsModalIsOpen}
								/>
							</>
						}
					/>
					<Route
						path="/:id"
						element={<NoteOutlet notesWithTags={notesWithTags} />}
					>
						<Route index element={<ViewNote onDelete={onDeleteNote} />} />
						<Route
							path="edit"
							element={
								<EditNote
									onSubmit={onUpdateNote}
									onAddTag={onAddTag}
									tagsWithNotesInfo={tagsWithNotesInfo}
									setEditTagsModalIsOpen={setEditTagsModalIsOpen}
								/>
							}
						/>
					</Route>
					{/* fallback route that goes back to homepage for unrecognized route */}
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</Container>
			<EditTagsModal
				show={editTagsModalIsOpen}
				handleClose={() => setEditTagsModalIsOpen(false)}
				tagsWithNotesInfo={tagsWithNotesInfo}
				onUpdateTag={onUpdateTag}
				onDeleteTag={onDeleteTag}
				setTags={setTags}
			/>
		</>
	);
}

export default App;
