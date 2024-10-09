import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

//when deploying in a subdirectory on a server, write the basename like example below (basename attribute is not needed when deploying on homepage (i.e. root directory))
//<BrowserRouter basename="/getem">

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
