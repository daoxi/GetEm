//Bootstrap allows styling using className, also contains default styling for most elements, which will be applied to all components
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Checklist from "./Checklist";
import { Container } from "react-bootstrap";
import { NewNote } from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidv4 } from 'uuid';

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
			//add all the tags with matching tag ids
			return {
				...note,
				tags: tags.filter((tag) => {
					note.tagIds.includes(tag.id);
				}),
			};
		});
	}, [notes, tags]);

	return (
		<Container className="my-4">
			<Routes>
				<Route
					path="/"
					element={
						<>
							<h1>Working</h1>
							<Checklist />
						</>
					}
				/>
				<Route
					path="/new"
					element={
						<>
							<NewNote />
						</>
					}
				/>
				<Route path="/:id">
					<Route index element={<h1>Show</h1>} />
					<Route path="edit" element={<h1>Edit</h1>} />
				</Route>
				{/* fallback route that goes back to homepage for unrecognized route */}
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</Container>
	);
}

export default App;
