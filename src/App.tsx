import { useState } from "react";
import "./styles.css";

export default function App() {
	const [newItem, setNewItem] = useState(""); //this state is for managing user input field
	const [items, setItems] = useState<any[]>([]); //useState([]) infers the type never[] from the default value [], so don't use it in TypeScript

	// the argument is an event object
	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault(); //prevent page from refreshing

		//updating the state
		setItems((currentItems) => {
			return [...currentItems, { id: crypto.randomUUID(), title: newItem, completed: false }];
		});

		setNewItem(""); //clears the field everytime it's submitted
	}

	function toggleItem(id: number, completed: boolean) {
		setItems((currentItems: any) => {
			return currentItems.map((item: any) => {
				//check each item and update the one that fired the onChange event
				if (item.id === id) {
					return { ...item, completed: completed };
				}
				return item;
			});
		});
	}

	function deleteItem(id: number) {
		setItems((currentItems: any) => {
			//using filter() instead of map() as the element to be deleted can't be properly mapped
			return currentItems.filter((item: any) => item.id !== id);
		});
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
			<h1 className="header">My list</h1>
			<ul className="list">
				{items.length === 0 && "You haven't added any item yet" /* short-circuiting */}
				{items.map((item) => {
					return (
						<li key={item.id}>
							<label>
								{/* update the state accordingly whenever the checkbox changes so that it's rendered properly */}
								<input type="checkbox" checked={item.completed} onChange={(e) => toggleItem(item.id, e.target.checked)} />
								{item.title}
							</label>
							<button className="btn btn-del" onClick={() => deleteItem(item.id)}>
								Delete
							</button>
						</li>
					);
				})}
			</ul>
		</>
	);
}
