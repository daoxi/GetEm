//Icon imports start
import { MdDeleteForever } from "react-icons/md";
//Icon imports end

//The following imports are partially referenced from the dnd-kit web-documentation "Sortable" template
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragStartEvent,
	DragEndEvent,
	DragOverlay,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
//"The following" ends

import { Options, TagWithNotesInfo } from "../App";
import {
	Stack,
	Form,
	Modal,
	Alert,
	Accordion,
	Container,
} from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import { SortableTagEditItem } from "./SortableTagEditItem";
import { TagEditItem } from "./TagEditItem";

type EditTagsModalProps = {
	show: boolean;
	handleCloseModal: () => void;
	options: Options;
	defaultOptions: Options;
	tagsWithNotesInfo: TagWithNotesInfo[];
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
	onReorderTags: (activeId: string, overId: string) => void;
	arrayMoveHelper: (
		prevStateArray: any[],
		activeId: string,
		overId: string
	) => any[];
};

export type TagInputWithStatus = {
	status: string;
} & TagWithNotesInfo;

export function EditTagsModal({
	show,
	handleCloseModal,
	options,
	defaultOptions,
	tagsWithNotesInfo,
	onUpdateTag,
	onDeleteTag,
	onReorderTags,
	arrayMoveHelper,
}: EditTagsModalProps) {
	//const [tagsInput, setTagsInput] = useState<TagWithNotesInfo[]>(structuredClone(tagsWithNotesInfo)); //alternative deep clone
	const [tagsInput, setTagsInput] = useState<TagWithNotesInfo[]>(
		tagsWithNotesInfo.map((tagWithNotesInfo) => {
			return { ...tagWithNotesInfo };
		})
	); //using a seperate deep cloned copy of the array tagsWithNotesInfo, React doesn't automatically update child state if it's cloned (which is the intended behavior)

	//update tagsInput whenever tagsWithNotesInfo is updated, each tag is conditionally updated (see below for more details)
	useEffect(() => {
		setTagsInput((prevTagsInput) => {
			return tagsWithNotesInfo.map((tagWithNotesInfo) => {
				if (
					prevTagsInput.find(
						(prevTagInput) => prevTagInput.id === tagWithNotesInfo.id
					) //if the tag already exists in tagsInput
				) {
					//keeping label the same as previously
					return {
						...tagWithNotesInfo,
						label: prevTagsInput.find(
							(prevTagInput) => prevTagInput.id === tagWithNotesInfo.id
						)!.label, //used non-null type assertion operator because it's already been checked to not be null in the earlier condition
					};
				} else {
					{
						//for any tag that doesn't exist in tagsInput, add it using the tag from tagsWithNotesInfo
						return { ...tagWithNotesInfo };
					}
				}
			});
		});
	}, [tagsWithNotesInfo]);

	function onUpdateTagInput(id: string, label: string) {
		setTagsInput((prevTags) => {
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

	//used to manage max length for input tag label
	let maxTagLabelLength = options.maxTagLabelLength
		? options.maxTagLabelLength
		: defaultOptions.maxTagLabelLength; //assume default value when undefined

	//tagsInputWithStatus gets updated whenever tagsInput or tagsWithNotesInfo changes
	const tagsInputWithStatus: TagInputWithStatus[] = useMemo(() => {
		return tagsInput.map((tagInput) => {
			let status = "unknown";
			if (tagInput.label === "") {
				status = "empty";
			} else if (tagInput.label.length > maxTagLabelLength) {
				status = "overlong";
			} else if (
				tagsInput
					.filter((tagsInputElement) => tagsInputElement.id !== tagInput.id)
					.some(
						(tagsInputRemainingElement) =>
							tagsInputRemainingElement.label === tagInput.label
					) //check if there's another tag with the same label as tagInput
			) {
				status = "duplicate";
			} else if (
				tagInput.label !==
				(tagsWithNotesInfo.find(
					(tagWithNotesInfo) => tagWithNotesInfo.id === tagInput.id
				) &&
					tagsWithNotesInfo.find(
						(tagWithNotesInfo) => tagWithNotesInfo.id === tagInput.id
					)!.label) //use short-circuiting to first check it's not undefined before using it with non-null type assertion operator
			) {
				status = "unsaved";
			} else {
				status = "good";
			}
			return { ...tagInput, status: status };
		});
	}, [maxTagLabelLength, tagsInput, tagsWithNotesInfo]);

	//referenced from the dnd-kit web-documentation "Sortable" template
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const [activeId, setActiveId] = useState<string | null>(null); //null implies no tag is being dragged now
	const activeTagWithNotesInfo: TagWithNotesInfo | undefined =
		tagsInputWithStatus.find((tag) => tag.id == activeId); //find the tag that's being dragged, returns undefined if not found

	function handleDragStart(event: DragStartEvent) {
		const { active } = event;
		setActiveId(active.id.toString());
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (over === null) {
			//stop here if it's null
			return;
		} else if (active.id !== over.id) {
			//if only using onReorderTags() to only update the tags state (from parent component), the tagsInput state will still be updated accordingly, however the dnd-kit drop animation will behave unexpectedly;
			//therefore, instead, use setTagsInput() first so that the drop animation behaves properly, then use onReorderTags() AFTER that.
			setTagsInput((prevTags) =>
				arrayMoveHelper(prevTags, active.id.toString(), over!.id.toString())
			); //using non-null type assertion here because it's already been checked to not be null
			onReorderTags(active.id.toString(), over!.id.toString()); //using non-null type assertion here because it's already been checked to not be null

			/*
			//legacy code (only as reference)

			setTagsInput((prevTags) => {
				const oldIndex = prevTags.findIndex(
					(prevTag) => prevTag.id === active.id.toString()
				);
				const newIndex = prevTags.findIndex(
					(prevTag) => prevTag.id === over!.id.toString() //using non-null type assertion here because it's already been checked to not be null
				);
				return arrayMove(prevTags, oldIndex, newIndex);
			});
			setTags((prevTags) => {
				const oldIndex = prevTags.findIndex(
					(prevTag) => prevTag.id === active.id.toString()
				);
				const newIndex = prevTags.findIndex(
					(prevTag) => prevTag.id === over!.id.toString() //using non-null type assertion here because it's already been checked to not be null
				);
				return arrayMove(prevTags, oldIndex, newIndex);
			});
			*/
		}

		setActiveId(null);
	};

	return (
		<Modal show={show} onHide={handleCloseModal}>
			<Modal.Header closeButton>
				<Modal.Title>Edit All Tags</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={tagsInputWithStatus}
							strategy={verticalListSortingStrategy}
						>
							<Stack gap={2}>
								{tagsInputWithStatus.map((tagInputWithStatus) => (
									<SortableTagEditItem
										key={tagInputWithStatus.id}
										tagInputWithStatus={tagInputWithStatus}
										maxTagLabelLength={maxTagLabelLength}
										onUpdateTagInput={onUpdateTagInput}
										onUpdateTag={onUpdateTag}
										onDeleteTag={onDeleteTag}
									/>
								))}
							</Stack>
						</SortableContext>
						<DragOverlay /* use DragOverlay component, otherwise the modal (for editing tags) will have unexpected movement when dragging a tag near edges of the window */
						>
							{activeId ? (
								<TagEditItem /* this is just for the visual element (i.e. tag) that you're seeing and holding onto while dragging */
									tagInputWithStatus={
										activeTagWithNotesInfo
											? activeTagWithNotesInfo
											: {
													/* object for fallback label message (e.g. for debugging) when undefined */
													id: "id not found",
													label: "drag and drop me",
													isUsedByNotes: false,
													status: "unknown",
											  }
									}
									/* id={activeId} //not needed because id is being extracted from "tagInputWithStatus" instead */
									isBeingDragged
								/>
							) : null}
						</DragOverlay>
					</DndContext>
				</Form>
				{tagsWithNotesInfo.length === 0 ? (
					<Alert variant="danger">You haven't added any tags yet.</Alert>
				) : (
					<Container className="mt-3">
						<h5 className="mb-3">Tips:</h5>
						<Accordion defaultActiveKey="0">
							<Accordion.Item eventKey="0">
								<Accordion.Header>General</Accordion.Header>
								<Accordion.Body>
									<Stack gap={0.3}>
										<p>
											<strong>Drag and drop</strong> tags to reorder them.
										</p>
										<p>
											Editing a tag affects <strong>all</strong> notes that use
											this tag.
										</p>
										<p>
											Invalid tags <strong>can't be saved,</strong> e.g.{" "}
											<strong>empty</strong>, <strong>duplicate</strong> (same
											label) , or <strong>overlong</strong> (caused by lowering
											length limit, current limit:{" "}
											<strong>{maxTagLabelLength}</strong>).
										</p>
									</Stack>
								</Accordion.Body>
							</Accordion.Item>
							<Accordion.Item eventKey="1">
								<Accordion.Header>Colors</Accordion.Header>
								<Accordion.Body>
									<h6>Tag labels:</h6>
									<p>
										<span className="border border-success py-1 px-2">
											Green border
										</span>
										<span>
											{" "}
											means the tag label is valid and up to date with saved
											data.
										</span>
									</p>
									<p>
										<span className="border border-warning py-1 px-2">
											Yellow border
										</span>
										<span>
											{" "}
											means the tag label is changed and can be saved, but
											hasn't been saved yet.
										</span>
									</p>
									<p>
										<span className="border border-danger py-1 px-2">
											Red border
										</span>
										<span>
											{" "}
											means the tag label is invalid (e.g.
											empty/duplicate/overlong), and thus can't be saved.
										</span>
									</p>
									<h6>Tag delete buttons:</h6>
									<span>
										<div
											className="d-inline-block text-warning border rounded border-warning"
											style={{ padding: "0.2rem 0.3rem" }}
										>
											<div className="d-flex align-items-center">
												<MdDeleteForever className="fs-5" />
											</div>
										</div>
									</span>{" "}
									(yellow delete button) means the tag is not currently being
									used by any notes (thus deleting it won't affect any notes).
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>
					</Container>
				)}
			</Modal.Body>
		</Modal>
	);
}
