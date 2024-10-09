import { useState } from "react";
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { Row } from "react-bootstrap";
import { SortableNoteCard } from "./SortableNoteCard";
import { NoteCard } from "./NoteCard";
import { Note, RawNote } from "../App";

type NotesListProps = {
	notesMode: string;
	notesToList: Note[];
} & Partial<NotesListPropsOptional>;

type NotesListPropsOptional = {
	setNotes: (
		newNotes: RawNote[] | ((newNotes: RawNote[]) => RawNote[])
	) => void; //only needed for "manage" mode
	onDeleteNote: (id: string) => void; //only needed for "manage" mode
};

export function NotesList({
	notesMode,
	notesToList,
	setNotes,
	onDeleteNote,
}: NotesListProps) {
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
					<NoteCard
						notesMode={notesMode}
						key={note.id}
						id={note.id}
						title={note.title}
						body={note.body}
						tags={note.tags}
					/>
				))}
			</Row>
		);
	} else if (notesMode === "manage") {
		const [activeId, setActiveId] = useState<string | null>(null); //null implies no note is being dragged now
		const activeNote: Note | undefined = notesToList.find(
			(note) => note.id == activeId
		); //find the note that's being dragged, returns undefined if not found

		const sensors = useSensors(
			useSensor(PointerSensor),
			useSensor(KeyboardSensor, {
				coordinateGetter: sortableKeyboardCoordinates,
			})
		);

		function handleDragStart(event: DragStartEvent) {
			const { active } = event;

			setActiveId(active.id.toString());
		}

		function handleDragEnd(event: DragEndEvent) {
			const { active, over } = event;

			if (over === null) {
				//stop here if it's null
				return;
			} else if (setNotes === undefined) {
				console.log("setNotes wasn't passed in"); //for debugging only
				return;
			} else if (active.id !== over.id) {
				setNotes((prevNotes) => {
					const oldIndex = prevNotes.findIndex(
						(prevNote) => prevNote.id === active.id.toString()
					);
					const newIndex = prevNotes.findIndex(
						(prevNote) => prevNote.id === over!.id.toString() //using non-null type assertion here because it's already been checked to not be null
					);
					return arrayMove(prevNotes, oldIndex, newIndex);
				});
			}

			setActiveId(null);
		}

		return (
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={
						notesToList
					} /* "strategy" attribute is {rectSortingStrategy} by default */
				>
					<Row
						xs={1}
						sm={2}
						lg={3}
						xl={4}
						/* Set number of columns for each screen size */ className="g-3" /* for gap */
					>
						{notesToList.map((note) => (
							<SortableNoteCard
								notesMode={notesMode}
								key={note.id}
								id={note.id}
								title={note.title}
								body={note.body}
								tags={note.tags}
								onDeleteNote={onDeleteNote!} //using non-null type assertion operator because "manage" mode is designed to always have this prop
							/>
						))}
					</Row>
				</SortableContext>
				<DragOverlay>
					{activeId ? (
						activeNote ? (
							<NoteCard /* this is just for the visual element (i.e. tag) that you're seeing and holding onto while dragging */
								notesMode={notesMode}
								id={activeId}
								title={activeNote.title}
								body={activeNote.body}
								tags={activeNote.tags}
								isBeingDragged
							/>
						) : (
							<p /* fallback message (e.g. for debugging) when undefined */>
								No note is being dragged now
							</p>
						)
					) : null}
				</DragOverlay>
			</DndContext>
		);
	}
}
