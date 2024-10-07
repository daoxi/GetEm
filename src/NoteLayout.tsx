import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom";
import { Note } from "./App";

type NoteLayoutProps = {
	notesWithTags: Note[];
};

export function NoteLayout({ notesWithTags }: NoteLayoutProps) {
	const { id } = useParams(); // get id from the URL
	const note = notesWithTags.find((noteWithTags) => noteWithTags.id === id); //find the note with matching id

	if (note == null) return <Navigate to="/" replace />; //go back to homepage for non-matching ids, use "replace" to replace the URL in order to prevent going back to the page that doesn't exist

	return <Outlet context={note} />; //renders what's inside this component, using data from context
}

//helper function for getting context
export function useNote() {
	return useOutletContext<Note>(); //useOutletContext() is used to get context in components that are inside (i.e. are children of) <Outlet />
}
