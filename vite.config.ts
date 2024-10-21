import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	//base: '', //setting base (which is '/' by default) to an empty string (equivalent to setting to './'), making the path relative to its deployment directory
});
