import { Card, Stack, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Note } from "../App";
import styles from "./NoteCard.module.scss";

export function NoteCard({
	/* also include "body" here if needed */
	id,
	title,
	tags,
}: Note) {
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
