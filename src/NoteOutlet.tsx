import {
	Navigate,
	Outlet,
	useOutletContext,
	useParams,
} from "react-router-dom";
import { Note } from "./App";

type NoteOutletProps = {
	notesWithTags: Note[];
};

export function NoteOutlet({ notesWithTags }: NoteOutletProps) {
	const { id } = useParams(); // get "id" from the URL
	const note = notesWithTags.find((noteWithTags) => noteWithTags.id === id); //find the note with matching id, to be used as context

	if (note == null) {
		return <Navigate to="/" replace />;
	} //go back to homepage for non-matching ids, use "replace" to replace the URL in order to prevent going back to the page that doesn't exist

	return <Outlet context={note} />; //renders the child component(s) nested inside this <Outlet /> component, using data from context
}

//helper function for getting context
export function useNote() {
	return useOutletContext<Note>(); //useOutletContext() is used to get context in components that are inside (i.e. are children of) <Outlet />
}
