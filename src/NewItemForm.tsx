import { useState } from "react";

export function NewItemForm() {
	const [newItem, setNewItem] = useState(""); //this state is for managing user input field

	// the argument is an event object
	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault(); //prevent page from refreshing

		//updating the state
		// setItems((currentItems) => {
		// 	return [...currentItems, { id: crypto.randomUUID(), title: newItem, completed: false }];
		// });

		setNewItem(""); //clears the field everytime it's submitted
	}

	return (
	<>
		<form onSubmit={handleSubmit} className="new-item-form">
			<div className="form-row">
				<label htmlFor="item">Enter your new item here</label>
				<input /* Set the value to use the state hook and update it using onChange */ value={newItem} onChange={(e) => setNewItem(e.target.value)} type="text" id="item"></input>
			</div>
			<button className="btn">Add</button>
		</form>
		</>)
}
