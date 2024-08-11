import { useState, useEffect } from "react";
import { NewItemForm } from "./NewItemForm";
import { ItemList } from "./ItemList";
import "./styles.scss";

export default function App() {
	//Use localStorage for initializing state unless if it's empty
	const [items, setItems] = useState<any[]>(() => {
		const myItems = localStorage.getItem("myItems");
		if (myItems === null) {
			return [];
		} else {
			return JSON.parse(myItems);
		}
	});

	//Save the data in localStorage whenever the state changes
	useEffect(() => {
		localStorage.setItem("myItems", JSON.stringify(items));
	}, [items]);

	//adding item to the current state array, this function will also be used in other component(s)
	function addItem(title: string) {
		//updating the state
		setItems((currentItems) => {
			return [...currentItems, { id: crypto.randomUUID(), title: title, completed: false }];
		});
	}

	//Toggling the checkbox on/off for the item
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

	//Removing item for which the user clicked the delete button
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
