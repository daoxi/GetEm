import { Alert, Button, Row } from "react-bootstrap";
import { NoteData, Options, Tag } from "../App";
import { v4 as uuidV4 } from "uuid";
import demoData from "./data-demo.json";
import { useState } from "react";

type DemoProps = {
	options: Options;
	defaultOptions: Options;
	onUpdateOptions: (optionName: string, newValue: any) => void;
	onCreateNote: ({ tags, ...data }: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	tags: Tag[];
};

export function Demo({
	options,
	defaultOptions,
	onUpdateOptions,
	onCreateNote,
	onAddTag,
	tags,
}: DemoProps) {
	const [showDemoTemp, setShowDemoTemp] = useState(true); //the "Temp" implies the state is reset (i.e. not permanently stored) the next time this page gets visited

	//generate all the notes for demo by using data from JSON
	function handleDemo() {
		//tags comes from parent component's state which is updated asynchronously (due to how setState() works),
		//so it's not ideal for tracking data in a loop in which the state might not have already been updated in the next iteration,
		//therefore a local array is made by using a shallow copy of the tags prop, this makes sure the existing tags are tracked properly
		const tagsDemo = [...tags];

		function addIdToTagLabel(tagLabels: string[], tagsDemo: Tag[]) {
			return tagLabels.map((tagLabel) => {
				if (
					tagsDemo.some((tag) => tag.label === tagLabel) //check if the tag label already exists
				) {
					return {
						//using the existing tag id
						id: tagsDemo.find((tag) => tag.label === tagLabel)!.id, //used the non-null operator here because the tag match has already been checked in the if statement's condition
						label: tagLabel,
					};
				} else {
					//if the tag label doesn't exist yet, add that to the existing tags with a new id
					const newTag = { id: uuidV4(), label: tagLabel };

					//update the local variable
					tagsDemo.push(newTag);
					//also update the state in parent component using callback function in parent component
					onAddTag(newTag);

					return newTag;
				}
			});
		}

		//loop through array from JSON and generate each note
		demoData.allNotesData.forEach((noteData) => {
			let tags = addIdToTagLabel(noteData.tagLabels, tagsDemo);
			onCreateNote({
				title: noteData.title,
				body: noteData.body,
				tags: tags,
			});
		});

		//add unused tags as examples
		addIdToTagLabel(["this tag is not used"], tagsDemo);
		addIdToTagLabel(["another unused tag"], tagsDemo);
	}

	return (
		<>
			<Alert
				variant="success"
				show={showDemoTemp && (options.hideDemoPerm === false || options.hideDemoPerm === undefined && defaultOptions.hideDemoPerm === false)}
				onClose={() => {
					setShowDemoTemp(false);
				}}
				dismissible
			>
				Would you like to generate some new notes data for demo purpose? (this
				won't overwrite your existing data)
				<br />
				<Row
					xs={1}
					sm={1}
					md={1}
					lg={1}
					xl={5}
					xxl={
						6
					} /* avoid having only 2 items on each row when there're 3 items in total */
				>
					<Button
						onClick={() => {
							handleDemo();
						}}
						variant="success"
						className="mx-2 my-2"
					>
						Generate Once
					</Button>
					<Button
						onClick={() => {
							setShowDemoTemp(false);
						}}
						variant="outline-secondary"
						className="mx-2 my-2"
					>
						Ask Later
					</Button>
					<Button
						onClick={() => {
							onUpdateOptions("hideDemoPerm", true);
						}}
						variant="outline-danger"
						className="mx-2 my-2"
					>
						Never Ask Again
					</Button>
				</Row>
			</Alert>
		</>
	);
}
