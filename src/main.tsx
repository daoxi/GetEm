import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

//allowing the React app to have routing relative to its deployment location in server file system, turns URL path into router basename by removing everything after the last slash
const getBasename = (path: string) => path.substring(0, path.lastIndexOf("/"));
//alternatively, use the following one-liner code:
//<BrowserRouter basename={window.location.pathname.replace(/(\/[^/]*)$/, "")}>
//alternatively, either hard-code the basename if deploying in a subdirectory (like code below), or just remove basename attribute if deploying on homepage (root directory)
//<BrowserRouter basename="/getem">

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter basename={getBasename(window.location.pathname)} /* set subdirectory for hosting here using basename */>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
