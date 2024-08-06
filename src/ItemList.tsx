export function ItemList ({items, toggleItem, deleteItem}:any) {

	return (
	<>
	<h1 className="header">My list</h1>
	<ul className="list">
		{items.length === 0 && "You haven't added any item yet" /* short-circuiting */}
		{items.map((item:any) => {
			return (
				<li key={item.id}> {/* Using React keys in the list array for best practice */}
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
	</>)
}
