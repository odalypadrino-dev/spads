import { useState, useContext } from "react";

import { GlobalState } from "@/GlobalState";

import DonorList from "@sections/DonorList";
import DonorSearch from "@sections/DonorSearch";

const Donors = () => {
	const state = useContext(GlobalState);
	const { donorAPI } = state;
	const { donors } = donorAPI;
	const { getDonors } = donors;
	const [ search, setSearch ] = useState('');

	return (
		<main className="flex flex-col items-center justify-start p-5 pt-3 w-full h-full gap-5 overflow-hidden">

			<DonorSearch searchState={ [ search, setSearch ] } />

			<DonorList search={ search } getDonors={ getDonors } />

		</main>
	);
};

export default Donors;