//the custom hook for storing and updating data locally

import { useEffect, useState } from "react";

//initialValue can be either a value or a function (that takes no argument), to be consistent with what useState() accepts as the initial state
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
	const [value, setValue] = useState<T>(() => {
		//check if there's already locally stored value
		const jsonValue = localStorage.getItem(key);
		if (jsonValue == null) {
			if (typeof initialValue === "function") {
				//cast the type as a function that returns generic type T
				return (initialValue as () => T)();
			} else {
				return initialValue;
			}
		} else {
			return JSON.parse(jsonValue);
		}
	});

	//everytime value or key changes, save in local storage
	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [value, key]);

	return [value, setValue] as [T, typeof setValue];
}
