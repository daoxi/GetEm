import { useMemo, useState } from "react";
import {
	Row,
	Col,
	Stack,
	Button,
	Form,
	Card,
	Badge,
	Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag } from "./App";
import styles from "./NoteList.module.css";

type SimplifiedNote = {
	title: string;
	id: string;
	tags: Tag[];
};

type NoteListProps = {
	availableTags: Tag[];
	notes: SimplifiedNote[];
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
};

type EditTagsModalProps = {
	show: boolean;
	availableTags: Tag[];
	handleClose: () => void;
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
};

export function NoteList({
	availableTags,
	notes,
	onUpdateTag,
	onDeleteTag,
}: NoteListProps) {
	const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
	const [title, setTitle] = useState("");
	const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

	const filteredNotes = useMemo(() => {
		return notes.filter((note) => {
			//checks for whether both the title and the tags match the search, returns a boolean
			return (
				//check for title, making it case-insensitive
				(title === "" ||
					note.title.toLowerCase().includes(title.toLowerCase())) &&
				//check for tags, for "every" selected tag, it should match "some" (i.e. at least one) tag for the note
				(selectedTags.length === 0 ||
					selectedTags.every((tag) =>
						note.tags.some((noteTag) => noteTag.id === tag.id)
					))
			);
		});
	}, [title, selectedTags, notes]);

	return (
		<>
			<Row className="align-items-center mb-4">
				<Col>
					<h1>Notes</h1>
				</Col>
				<Col
					xs="auto" /* use this to push the buttons all the way to the right side */
				>
					<Stack gap={2} direction="horizontal">
						<Link to="/new">
							<Button variant="primary">Create</Button>
						</Link>
						<Button
							onClick={() => setEditTagsModalIsOpen(true)}
							variant="outline-secondary"
						>
							Edit Tags
						</Button>
					</Stack>
				</Col>
			</Row>
			<Form>
				<Row className="mb-4">
					<Col>
						<Form.Group controlId="title">
							<Form.Label>Title</Form.Label>
							<Form.Control
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group controlId="tags">
							<Form.Label>Search Tags</Form.Label>

							<ReactSelect
								//Chose ReactSelect component here (instead of CreatableReactSelect), because no new tag will be created

								value={selectedTags.map((tag) => {
									//CreatableReactSelect expects a label and an id
									return { label: tag.label, value: tag.id };
								})}
								options={availableTags.map((tags) => {
									return { label: tags.label, value: tags.id };
								})}
								onChange={(tags) => {
									setSelectedTags(
										tags.map((tag) => {
											//This is what is actually stored, which can be converted from what CreatableReactSelect expects
											return { label: tag.label, id: tag.value };
										})
									);
								}}
								isMulti
							/>
						</Form.Group>
					</Col>
				</Row>
			</Form>
			<Row
				xs={1}
				sm={2}
				lg={3}
				xl={4}
				/* Set number of columns for each screen size */ className="g-3" /* for gap */
			>
				{filteredNotes.map((note) => (
					<Col key={note.id}>
						<NoteCard id={note.id} title={note.title} tags={note.tags} />
					</Col>
				))}
			</Row>
			<EditTagsModal
				show={editTagsModalIsOpen}
				handleClose={() => setEditTagsModalIsOpen(false)}
				availableTags={availableTags}
				onUpdateTag={onUpdateTag}
				onDeleteTag={onDeleteTag}
			/>
		</>
	);
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
	return (
		<Card
			as={Link}
			to={`/${id}`}
			className={`h-100 text-reset text-decoration-none ${styles.card}`} /* h-100 to fill the full height, ${styles.card} for CSS module for more detailed styles */
		>
			<Card.Body>
				<Stack
					gap={2}
					className="h-100 align-items-center justify-content-center"
				>
					<span className="fs-5">{title}</span>
					{tags.length > 0 && (
						<Stack
							gap={1}
							direction="horizontal"
							className="justify-content-center flex-wrap"
						>
							{tags.map((tag) => (
								<Badge
									className="text-truncate"
									/* prevents long text overflow */ key={tag.id}
								>
									{tag.label}
								</Badge>
							))}
						</Stack>
					)}
				</Stack>
			</Card.Body>
		</Card>
	);
}

function EditTagsModal({
	availableTags,
	show,
	handleClose,
	onUpdateTag,
	onDeleteTag,
}: EditTagsModalProps) {
	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Edit Tags</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Stack gap={2}>
						{availableTags.map((tag) => (
							<Row key={tag.id}>
								<Col>
									<Form.Control
										type="text"
										value={tag.label}
										onChange={(e) => onUpdateTag(tag.id, e.target.value)}
									/>
								</Col>
								<Col xs="auto">
									<Button
										onClick={() => onDeleteTag(tag.id)}
										variant="outline-danger"
									>
										✕
									</Button>
								</Col>
							</Row>
						))}
					</Stack>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
