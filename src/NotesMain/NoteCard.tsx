import { Card, Stack, Badge, Col, Button, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Note } from "../App";
import styles from "./NoteCard.module.scss";
import { forwardRef } from "react";

type NoteCardProps = { notesMode: string } & Note &
	Partial<NoteCardPropsOptional>;

type NoteCardPropsOptional = {
	isBeingDragged: boolean;
	onDeleteNoteWithConfirm: (id: string) => void;
	[propName: string]: any; //use this to represent all remaining props of any type
};

export const NoteCard = forwardRef(
	(
		{
			notesMode,
			/* also include "body" below if needed */
			id,
			title,
			tags,
			isBeingDragged,
			onDeleteNoteWithConfirm,
			...props
		}: NoteCardProps,
		ref
	) => {
		return (
			<Col ref={ref} style={props.style}>
				<Card
					className={`h-100 text-reset text-decoration-none ${styles.card}`} /* h-100 to fill the full height, ${styles.card} for CSS module for more detailed styles */
				>
					<Card.Img
						{...props.attributes}
						{...props.listeners}
						variant="top"
						src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="2rem" width="100%"></svg>' //the height of the svg controls height of the draggable pattern area
						className={`${notesMode !== "manage" && "d-none"} ${
							styles["draggable-area"]
						} ${
							isBeingDragged
								? styles["drag-cursor-active"]
								: styles["drag-cursor"]
						}`}
						style={{
							touchAction:
								"none" /* this makes sure the drag-and-drop works properly on touch devices */,
						}}
					/>
					<Card.Body
						as={Link}
						to={`/${id}`}
						className="text-decoration-none" /* remove underline caused by Link */
					>
						<Stack
							gap={2}
							className="h-100 align-items-center justify-content-center"
						>
							<Card.Title>{title}</Card.Title>
							{tags.length > 0 && (
								<Stack
									gap={1}
									direction="horizontal"
									className="justify-content-center flex-wrap"
								>
									{tags.map((tag) => (
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
						</Stack>
					</Card.Body>
					<Card.Footer className={`${notesMode !== "manage" && "d-none"}`}>
						<Row>
							<Col>
								<Link to={`/${id}/edit`}>
									<Button variant="outline-primary" size="sm" className="w-100">
										Edit
									</Button>
								</Link>
							</Col>
							<Col>
								<Button
									variant="outline-danger"
									size="sm"
									className="w-100"
									onClick={() => {
										onDeleteNoteWithConfirm!(id); //using non-null type assertion operator because "manage" mode is designed to always have this prop
									}}
								>
									Delete
								</Button>
							</Col>
						</Row>
					</Card.Footer>
				</Card>
			</Col>
		);
	}
);
