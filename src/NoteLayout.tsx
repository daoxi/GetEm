import { Navigate, Outlet, useParams } from "react-router-dom";
import { Note } from "./App";

type NoteLayoutProps = {
	notes: Note[];
};

export function NoteLayout({ notes }: NoteLayoutProps) {
	const { id } = useParams(); // get id from the URL
	const note = notes.find((note) => note.id === id); //find the note with matching id

	if (note == null) return <Navigate to="/" replace />; //use "replace" to replace the URL in order to prevent going back to the page that doesn't exist

	return <Outlet context={note} />; //renders what's inside this component, using data from context
}
