import { Button } from "react-bootstrap";
import { NoteData, Tag } from "../App";
import { v4 as uuidV4 } from "uuid";
import demoData from "./data-demo.json";

type DemoProps = {
	onCreateNote: ({ tags, ...data }: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	availableTags: Tag[];
};

export function Demo({ onCreateNote, onAddTag, availableTags }: DemoProps) {
	//generate all the notes for demo by using data from JSON
	function handleDemo() {
		//availableTags comes from parent component's state which is updated asynchronously (due to how setState() works),
		//so it's not good for tracking data in a loop in which the state might not have already been updated in the next iteration,
		//therefore a local array is made by using a shallow copy of the availableTags prop, this makes sure the existing tags are tracked properly
		const availableTagsDemo = [...availableTags];

		function addIdToTagLabel(tagLabels: string[], availableTagsDemo: Tag[]) {
			return tagLabels.map((tagLabel) => {
				if (
					availableTagsDemo.some(
						(availableTag) => availableTag.label === tagLabel
					) //check if the tag label already exists
				) {
					return {
						//using the existing tag id
						id: availableTagsDemo.find(
							(availableTag) => availableTag.label === tagLabel
						)!.id, //used the non-null operator here because the tag match has already been checked in the if statement's condition
						label: tagLabel,
					};
				} else {
					//if the tag label doesn't exist yet, add that to the existing tags with a new id
					const newTag = { id: uuidV4(), label: tagLabel };

					//update the local variable
					availableTagsDemo.push(newTag);
					//also update the state in parent component using callback function in parent component
					onAddTag(newTag);

					return newTag;
				}
			});
		}

		demoData.allNotesData.forEach((noteData) => {
			let tags = addIdToTagLabel(noteData.tagLabels, availableTagsDemo);
			onCreateNote({
				title: noteData.title,
				body: noteData.body,
				tags: tags,
			});
		});
	}

	return (
		<Button
			onClick={() => {
				handleDemo();
			}}
			variant="outline-primary"
		>
			Create Demo
		</Button>
	);
}
