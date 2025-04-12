import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @param { Array<clsx.ClassValue> } classList 
 * @returns { string }
 */
const cn = (...classList) => {
	return twMerge(clsx(classList));
};

export default cn;