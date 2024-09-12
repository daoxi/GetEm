import "bootstrap/dist/css/bootstrap.min.css";
//Bootstrap allows styling using className, also contains default styling for most elements, which will be applied to all components
import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { NewNote } from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import { NoteList } from "./NoteList";
import { NoteLayout } from "./NoteLayout";
import { Note } from "./Note";
import { EditNote } from "./EditNote";

//Note data with the id
export type Note = {
	id: string;
} & NoteData;

//Note data without the id
export type NoteData = {
	title: string;
	markdown: string;
	tags: Tag[];
};

//Raw note data with the id
export type RawNote = {
	id: string;
} & RawNoteData;

//Raw note data without the id
export type RawNoteData = {
	title: string;
	markdown: string;
	//store only the ids of the tags, so that when tags' values change, there's no need to update each note
	tagIds: string[];
};

export type Tag = {
	id: string;
	label: string;
};

function App() {
	const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
	const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

	//convert raw note into actual note with tags (instead of just with ids of tags), and update it whenever there's any change on the notes or tags
	const notesWithTags = useMemo(() => {
		return notes.map((note) => {
			//add all the tags (that have matching tag ids) to the raw note
			return {
				...note,
				tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
			};
		});
	}, [notes, tags]);

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

	function addTag(tag: Tag) {
		setTags((prev) => [...prev, tag]);
	}

	function updateTag(id: string, label: string) {
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

	function deleteTag(id: string) {
		setTags((prevTags) => {
			return prevTags.filter((tag) => tag.id !== id); //keeping all notes that are not supposed to be deleted
		});
	}

	return (
		<Container className="my-4">
			<Routes>
				<Route
					index
					/* path="/" */
					element={
						<>
							<NoteList
								notes={notesWithTags}
								availableTags={tags}
								onUpdateTag={updateTag}
								onDeleteTag={deleteTag}
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
								onAddTag={addTag}
								availableTags={tags}
							/>
						</>
					}
				/>
				<Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
					<Route index element={<Note onDelete={onDeleteNote} />} />
					<Route
						path="edit"
						element={
							<EditNote
								onSubmit={onUpdateNote}
								onAddTag={addTag}
								availableTags={tags}
							/>
						}
					/>
				</Route>
				{/* fallback route that goes back to homepage for unrecognized route */}
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</Container>
	);
}

export default App;
