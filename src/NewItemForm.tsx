//Contains the form used for users to add a new item to the list

import { useState } from "react";

export function NewItemForm({ addItem }: any) {
	const [newItem, setNewItem] = useState(""); //this state is for managing user input field

	// the argument is an event object
	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault(); //prevent page from refreshing

		if (newItem !== "") {
			addItem(newItem); //adding item to the list
			setNewItem(""); //clears the field everytime it's submitted
		} else {
			alert("your input is empty!");
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit} className="new-item-form">
				<div className="form-row">
					<label htmlFor="item">Enter your new item here</label>
					<input /* Set the value to use the state hook and update it using onChange */ value={newItem} onChange={(e) => setNewItem(e.target.value)} type="text" id="item"></input>
				</div>
				<button className="btn btn-add">Add</button>
			</form>
		</>
	);
}
