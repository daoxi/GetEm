import { Button } from "react-bootstrap";
import { NoteData, Tag } from "../App";
import { v4 as uuidV4 } from "uuid";
import * as demoData from "./demodata.json";

type DemoProps = {
	onCreateNote: ({ tags, ...data }: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	availableTags: Tag[];
};

export function Demo({ onCreateNote, onAddTag, availableTags }: DemoProps) {
	function handleDemo() {
		console.log("demo on");

		//let demoData = require("./demodata.json");
		//console.log(demoData);

		function addIdToTagLabel(tagLabels: string[], availableTags: Tag[]) {
			return tagLabels.map((tagLabel) => {
				if (
					availableTags.some((availableTag) => availableTag.label === tagLabel) //check if the tag label already exists
				) {
					return {
						//using the existing tag id
						id: availableTags.find(
							(availableTag) => availableTag.label === tagLabel
						)!.id, //used the non-null operator here because the tag match has already been checked in the if statement's condition
						label: tagLabel,
					};
				} else {
					//if the tag label doesn't exist yet, add that to the existing tags with a new id
					const newTag = { id: uuidV4(), label: tagLabel };
					onAddTag(newTag);
					return newTag;
				}
			});
		}

		const demoDataTest = {
			title: "Test1",
			body: "test1 BODY",
			tagLabels: ["test1tag", "test2b"],
		};

		const demoNote = {
			title: demoDataTest.title,
			body: demoDataTest.body,
			tags: addIdToTagLabel(demoDataTest.tagLabels, availableTags),
		};

		onCreateNote(demoNote);
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
