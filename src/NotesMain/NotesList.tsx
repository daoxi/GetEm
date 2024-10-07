import { Col, Row } from "react-bootstrap";
import { NoteCard } from "./NoteCard";
import { Note } from "../App";

type NotesListProps = {
	notesMode: string;
	notesToList: Note[];
};

export function NotesList({ notesMode, notesToList }: NotesListProps) {
	if (notesMode === "view") {
		return (
			<Row
				xs={1}
				sm={2}
				lg={3}
				xl={4}
				/* Set number of columns for each screen size */ className="g-3" /* for gap */
			>
				{notesToList.map((note) => (
					<Col key={note.id}>
						<NoteCard
							id={note.id}
							title={note.title}
							body={note.body}
							tags={note.tags}
						/>
					</Col>
				))}
			</Row>
		);
	} else if (notesMode === "manage") {
		return (
			<Row
				xs={1}
				sm={2}
				lg={3}
				xl={4}
				/* Set number of columns for each screen size */ className="g-3" /* for gap */
			>
				{notesToList.map((note) => (
					<Col key={note.id}>
						<NoteCard
							id={note.id}
							title={note.title}
							body={note.body}
							tags={note.tags}
						/>
					</Col>
				))}
			</Row>
		);
	}
}
