//Contains the list that includes all the items that were added by the user

export function ItemList({ items, toggleItem, editItem, deleteItem }: any) {
	return (
		<>
			<h1 className="list-header">My list</h1>
			<p className="list-intro">(your edits will be saved automatically)</p>
			<ul className="item-list">
				{items.length === 0 && "You haven't added any item yet" /* short-circuiting */}
				{items.map((item: any) => {
					return (
						<li key={item.id}>
							{/* Using React keys in the list array for best practice */}{" "}
							<label className="item-checkbox-container">
								<input className="item-checkbox" type="checkbox" checked={item.completed} onChange={(e) => toggleItem(item.id, e.target.checked) /* update the state accordingly whenever the checkbox changes so that it's rendered properly */} />
							</label>
							<label className="item-title-container">
								<input className="item-title" type="text" value={item.title} onChange={(e) => editItem(item.id, e.target.value)}></input>
							</label>
							<button className="btn btn-del" onClick={() => deleteItem(item.id)}>
								✕
							</button>
						</li>
					);
				})}
			</ul>
		</>
	);
}
