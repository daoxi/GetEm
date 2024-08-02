import { useState } from "react";
import "./styles.css";

export default function App() {
	const [newItem, setNewItem] = useState("");
	const [todos, setTodos] = useState<any[]>([]); //useState([]) infers the type never[] from the default value [], so don't use it in TypeScript

	// the argument is an event object, just leaving it as any type for now
	function handleSubmit(e: any) {
		e.preventDefault(); //prevent page from refreshing

		//updating the state
		setTodos((currentTodos) => {
			return [...currentTodos, { id: crypto.randomUUID(), title: newItem, completed: false }];
		});

		setNewItem(""); //clears the field everytime it's submitted
	}

	return (
		<>
			<form onSubmit={handleSubmit} className="new-item-form">
				<div className="form-row">
					<label htmlFor="item">New Item</label>
					<input /* Set the value to use the state hook and update it using onChange */ value={newItem} onChange={(e) => setNewItem(e.target.value)} type="text" id="item"></input>
				</div>
				<button className="btn">Add</button>
			</form>
			<h1 className="header">My list</h1>
			<ul className="list">
				{todos.map((todo) => {
					return (
						<li key={todo.id}>
							<label>
								<input type="checkbox" checked={todo.completed} />
								{todo.title}
							</label>
						</li>
					);
				})}
			</ul>
		</>
	);
}
