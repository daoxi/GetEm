import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

//when deploying in a subdirectory on a server, write the basename like example below (basename attribute is not needed when deploying on homepage (i.e. root directory))
//<BrowserRouter basename="/getem">

//alternatively, use a hacky move to allow the React app to have routing relative to its deployment location in server file system
//(issue (for both options): when manually entering URL with multiple-nested route in browser address bar, routing may have unexpected behavior.)
//- option 1:
//const getBasename = (path: string) => path.substring(0, path.lastIndexOf("/")); //put this line before "ReactDOM.createRoot..." //turns URL path into router basename by removing everything after the last slash
//<BrowserRouter basename={getBasename(window.location.pathname)} /* set subdirectory for hosting here using basename */>
//- option 2:
//<BrowserRouter basename={window.location.pathname.replace(/(\/[^/]*)$/, "")}> //one-liner code

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
