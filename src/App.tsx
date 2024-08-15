//Bootstrap allows styling using className, also contains default styling for most elements, which will be applied to all components
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Checklist from "./Checklist";
import { Container } from "react-bootstrap";
import { NewNote } from "./NewNote";

function App() {
	return (
		<Container className="my-4">
		<Routes>
			<Route
				path="/"
				element={
					<>
						<h1>Working</h1>
						<Checklist />
					</>
				}
			/>
			<Route
				path="/new"
				element={
					<>
						<NewNote />
					</>
				}
			/>
			<Route path="/:id">
				<Route index element={<h1>Show</h1>}/>
				<Route path="edit" element={<h1>Edit</h1>} />
			</Route>
			{/* fallback route that goes back to homepage for unrecognized route */}
			<Route path="*" element={<Navigate to="/"/>} />
		</Routes>
		</Container>
	);
}

export default App;
