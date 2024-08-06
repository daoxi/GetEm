import { useState } from "react";
import { NewItemForm } from "./NewItemForm";
import { ItemList } from "./ItemList";
import "./styles.css";

export default function App() {
	const [items, setItems] = useState<any[]>([]); //useState([]) infers the type never[] from the default value [], so don't use it in TypeScript

	function addItem(title: string) {
		//updating the state
		setItems((currentItems) => {
			return [...currentItems, { id: crypto.randomUUID(), title: title, completed: false }];
		});
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
			<NewItemForm addItem={addItem} /> {/* passing the function as props */}
			<ItemList items={items} toggleItem={toggleItem} deleteItem={deleteItem} />
		</>
	);
}
