import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import { useNote } from "./NoteOutlet";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

type ViewNoteProps = {
	onDelete: (id: string) => void;
};

export function ViewNote({ onDelete }: ViewNoteProps) {
	const note = useNote();
	const navigate = useNavigate();

	return (
		<>
			<Row className="align-items-center mb-4">
				<Col>
					<h1>{note.title}</h1>
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
					xs="auto" /* use this to push the buttons all the way to the right side */
				>
					<Stack gap={2} direction="horizontal">
						<Link to={`/${note.id}/edit`}>
							<Button variant="primary">Edit</Button>
						</Link>
						<Button
							onClick={() => {
								onDelete(note.id);
								navigate("/");
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
			>
				{note.body}
			</ReactMarkdown>
		</>
	);
}