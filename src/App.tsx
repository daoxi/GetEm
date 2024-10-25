import "bootstrap/dist/css/bootstrap.min.css";
//Bootstrap allows styling using className, also contains default styling for most elements, which will be applied to all components
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { OptionsModal } from "./OptionsModal";

export type Options = {
	[optionName: string]: any; //this allows any string as option name and stores any type of value
};

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
	const navigate = useNavigate();

	const [options, setOptions] = useLocalStorage<Options>("OPTIONS", {});
	//default values are assumed for all undefined (i.e. not set yet) properties in options, and they are:
	//hideDemoPerm : false; activeMainTabKey : "search"; deleteNoteRequireConfirm : true; excludeUnusedTagsForSearch : true; hideTooltips : false; tagsOrderAffectNotes: true
	//maxNoteTitleLength : 80; maxTagLabelLength: 30;

	const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
	const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

	//tracks whether the modal for changing options should be open
	const [optionsModalIsOpen, setOptionsModalIsOpen] = useState(false);
	//tracks whether the modal for editing tags should be open
	const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);
	//tracks whether the modal for confirming note deletion should be open
	const [deleteConfirmModalIsOpen, setDeleteConfirmModalIsOpen] =
		useState(false);
	//tracks the id for the note to be deleted from Modal
	const [deleteConfirmModalNoteId, setDeleteConfirmModalNoteId] = useState("");

	//convert raw note into actual note with tags (instead of just with ids of tags), and update it whenever there's any change on the related option or notes or tags
	const notesWithTags: Note[] = useMemo(() => {
		if (
			options.tagsOrderAffectNotes === undefined ||
			options.tagsOrderAffectNotes ===
				true /* this option is assumed to be true when undefined */
		) {
			return notes.map((note) => {
				//add all the tags (that have matching tag ids) to the raw note
				return {
					...note,
					tags: tags.filter((tag) =>
						note.tagIds.includes(tag.id)
					) /* this reorders the tags in the returned array, using order of tags from the "tags" state */,
				};
			});
		} else {
			return notes.map((note) => {
				return {
					...note,
					tags: note.tagIds
						.filter(
							(tagId) =>
								tags.find(
									(tag) => tag.id === tagId
								) /* first filter out all tagIds that can't be found in tags */
						)
						.map(
							(tagId) => tags.find((tag) => tag.id === tagId)! //used non-null type assertion because the .filter() already filtered out all tagIds that can't be found in tags
						) /* this keeps tags order (in the returned array) the same as note.tagIds */,
				};
			});
		}
	}, [options.tagsOrderAffectNotes, notes, tags]);

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

	function onUpdateOptions(optionName: string, newValue: any) {
		setOptions((prevOptions) => {
			return { ...prevOptions, [optionName]: newValue };
		});
	}

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

	function onDeleteNoteWithConfirm(id: string) {
		if (
			options.deleteNoteRequireConfirm === undefined ||
			options.deleteNoteRequireConfirm ===
				true /* this option is assumed to be true when undefined (i.e. not set yet) */
		) {
			setDeleteConfirmModalNoteId(id);
			setDeleteConfirmModalIsOpen(true);
		} else {
			onDeleteNote(id);
			navigate("/");
		}
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
			return prevTags.filter((tag) => tag.id !== id); //keeping all notes that are not supposed to be deleted
		});

		//also delete the tag from notes
		setNotes((prevNotes) => {
			return prevNotes.map((note) => {
				return {
					...note,
					tagIds: note.tagIds.filter((tagId) => tagId !== id),
				};
			});
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
									options={options}
									onUpdateOptions={onUpdateOptions}
									onCreateNote={onCreateNote}
									onAddTag={onAddTag}
									tags={tags}
								/>
								<NotesMain
									options={options}
									onUpdateOptions={onUpdateOptions}
									setOptionsModalIsOpen={setOptionsModalIsOpen}
									notesWithTags={notesWithTags}
									setNotes={setNotes}
									onDeleteNoteWithConfirm={onDeleteNoteWithConfirm}
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
									options={options}
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
						<Route
							index
							element={
								<ViewNote onDeleteNoteWithConfirm={onDeleteNoteWithConfirm} />
							}
						/>
						<Route
							path="edit"
							element={
								<EditNote
									options={options}
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
			<OptionsModal
				show={optionsModalIsOpen}
				handleClose={() => setOptionsModalIsOpen(false)}
				options={options}
				setOptions={setOptions}
				onUpdateOptions={onUpdateOptions}
			/>
			<EditTagsModal
				show={editTagsModalIsOpen}
				handleClose={() => setEditTagsModalIsOpen(false)}
				options={options}
				tagsWithNotesInfo={tagsWithNotesInfo}
				onUpdateTag={onUpdateTag}
				onDeleteTag={onDeleteTag}
				setTags={setTags}
			/>
			<DeleteConfirmModal
				show={deleteConfirmModalIsOpen}
				handleClose={() => setDeleteConfirmModalIsOpen(false)}
				id={deleteConfirmModalNoteId}
				onDeleteNote={onDeleteNote}
			/>
		</>
	);
}

export default App;
