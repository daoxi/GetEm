import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import { useNote } from "./NoteOutlet";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import styles from "./ViewNote.module.scss";

type ViewNoteProps = {
	onDeleteNoteWithConfirm: (id: string) => void;
};

export function ViewNote({ onDeleteNoteWithConfirm }: ViewNoteProps) {
	const note = useNote();

	return (
		<>
			<Row
				xs={1}
				sm={1}
				md={1}
				lg={2}
				xl={2}
				xxl={2}
				/* Set number of columns for different screen sizes */ className="align-items-center mb-4"
			>
				<Col className="mb-3">
					<h1 style={{ overflowWrap: "anywhere" }}>{note.title}</h1>
					{note.tags.length > 0 && (
						<Stack gap={1} direction="horizontal" className="flex-wrap">
							{note.tags.map((tag) => (
								<Badge
									bg="dark"
									className="text-truncate"
									/* prevents long text overflow */ key={tag.id}
								>
									{tag.label}
								</Badge>
							))}
						</Stack>
					)}
				</Col>
				<Col
				//xs="auto" /* use this to push the buttons all the way to the right side */
				>
					<Stack gap={2} direction="horizontal" className="justify-content-end">
						<Link to={`/${note.id}/edit`}>
							<Button variant="primary">Edit</Button>
						</Link>
						<Button
							onClick={() => {
								onDeleteNoteWithConfirm(note.id);
							}}
							variant="outline-danger"
						>
							Delete
						</Button>
						<Link to="/">
							<Button variant="outline-secondary">Back</Button>
						</Link>
					</Stack>
				</Col>
			</Row>
			<ReactMarkdown /* checkboxes are part of GitHub Flavored Markdown (GFM), check react-markdown for more info on how to enabled it through a plugin */
				className={`${styles["react-markdown"]}`}
			>
				{note.body}
			</ReactMarkdown>
		</>
	);
}
