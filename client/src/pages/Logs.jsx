import { useState, useContext } from "react";

import { GlobalState } from "@/GlobalState";

import LogList from "@sections/LogList";
import LogSearch from "@sections/LogSearch";

const Logs = () => {
	const state = useContext(GlobalState);
	const { rootAPI, modal: [ , newModal ] } = state;
	const { getLogs } = rootAPI;
	const [ search, setSearch ] = useState('');

	return (
		<main className="flex flex-col items-center justify-start p-5 pt-3 w-full gap-5">

			<LogSearch searchState={ [ search, setSearch ] } />

			<LogList search={ search } getLogs={ getLogs } newModal={ newModal } />

		</main>
	);
};

export default Logs;