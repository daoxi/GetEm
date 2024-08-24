//Bootstrap allows styling using className, also contains default styling for most elements, which will be applied to all components
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Checklist from "./Checklist";
import { Container } from "react-bootstrap";
import { NewNote } from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";

//Note data with the id 
export type Note = {
	id: string
} & NoteData

export type RawNote = {
	id: string
}

export type RawNoteData = {
	title: string,
	markdown: string,
	//store only the ids of the tags, so that when tags' values change, there's no need to update each note
	tagIds: string []
}

//Note data without the id 
export type NoteData = {
	title: string,
	markdown: string,
	tags: Tag[]
}

export type Tag = {
	id: string,
	label: string
}

function App() {
	const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
	const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

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
				<Route index element={<h1>Show</h1>}/>
				<Route path="edit" element={<h1>Edit</h1>} />
			</Route>
			{/* fallback route that goes back to homepage for unrecognized route */}
			<Route path="*" element={<Navigate to="/"/>} />
		</Routes>
		</Container>
	);
}

export default App;
