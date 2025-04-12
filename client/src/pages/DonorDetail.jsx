import { useContext } from "react";

import { GlobalState } from "@/GlobalState";

import DonorInfo from "@sections/DonorInfo";
import DonationStatus from "@sections/DonationStatus";
import DonorTabs from "@sections/DonorTabs";

const DonorDetail = () => {
	const state = useContext(GlobalState);
	const { userAPI, donorAPI, modal: [ , newModal ], handlers } = state;
	const { user: [ { isAdmin } ] } = userAPI;
	const { donors, healthConditions, bloodTests, donations } = donorAPI;

	return (
		<main className="flex print:flex-col items-start justify-start p-5 pt-3 w-full gap-5 overflow-hidden">

			<article className="flex items-center justify-between w-fit print:w-full h-full print:h-fit">
				<DonorInfo donors={ donors } newModal={ newModal } handlers={ handlers } isAdmin={ isAdmin } />
			</article>

			<article className="flex flex-1 flex-col print:w-full h-full gap-5 overflow-y-auto">

				<DonationStatus donations={ donations } isAdmin={ isAdmin } />

				<DonorTabs tabsData={{ healthConditions, bloodTests, donations }} isAdmin={ isAdmin } />

			</article>

		</main>
	);
};
export default DonorDetail;