//Bootstrap contains default styling for most HTML elements, which will be applied to all components
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Checklist from "./Checklist";

function App() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<>
						<h1>Working</h1>
						<Checklist />
					</>
				}
			></Route>
		</Routes>
	);
}

export default App;
