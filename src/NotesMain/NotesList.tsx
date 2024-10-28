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
	SortableContext,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { Row } from "react-bootstrap";
import { SortableNoteCard } from "./SortableNoteCard";
import { NoteCard } from "./NoteCard";
import { Note } from "../App";

type NotesListProps = {
	notesMode: string;
	notesToList: Note[];
} & Partial<NotesListPropsOptional>;

type NotesListPropsOptional = {
	onDeleteNoteWithConfirm: (id: string) => void; //only needed for "manage" mode
	onReorderNotes: (activeId: string, overId: string) => void; //only needed for "manage" mode
};

export function NotesList({
	notesMode,
	notesToList,
	onDeleteNoteWithConfirm,
	onReorderNotes,
}: NotesListProps) {
	if (notesMode === "view") {
		return (
			<Row
				xs={1}
				sm={1}
				md={1}
				lg={2}
				xl={3}
				xxl={4}
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
			} else if (onReorderNotes === undefined) {
				console.log("onReorderNotes wasn't passed in"); //for debugging only
				return;
			} else if (active.id !== over.id) {
				onReorderNotes(
					active.id.toString(),
					over!.id.toString() //using non-null type assertion here because it's already been checked to not be null
				);
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
						sm={1}
						md={1}
						lg={2}
						xl={3}
						xxl={4}
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
								onDeleteNoteWithConfirm={onDeleteNoteWithConfirm!} //using non-null type assertion operator because "manage" mode is designed to always have this prop
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
								style={{
									padding:
										"0 0.5rem" /* do this to prevent the card from becoming slightly wider while being dragged (probably due to missing x-axis paddings on its container), 
										"g-3" class name in <Row> (under <SortableContext>) sets the css variable "--bs-gutter-x" to 1rem (defaults is 1.5rem), and x-axis paddings are half of it */,
								}}
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
