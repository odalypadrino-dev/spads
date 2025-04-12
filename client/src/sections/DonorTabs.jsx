import { useState, useContext } from "react";

import { GlobalState } from "@/GlobalState";

import cn from "@lib/cn";

import HealthConditionTab from "@sections/components/HealthConditionTab";
import BloodTestsTab from "@sections/components/BloodTestsTab";
import DonationsTab from "@sections/components/DonationsTab";

const TAB_OPTIONS = [
	{
		label: 'healthConditions',
		title: "Condiciones de Salud",
		content: HealthConditionTab
	},
	{
		label: 'bloodTests',
		title: "Exámenes de Sangre",
		content: BloodTestsTab
	},
	{
		label: 'donations',
		title: "Donaciones",
		content: DonationsTab
	}
];

const DonorTabs = ({ tabsData, isAdmin }) => {
	const state = useContext(GlobalState);
	const { modal: [ , setModal ] } = state;
	const [ tab, setTab ] = useState(TAB_OPTIONS[0].label);

	const handleTab = t => {
		if (tab !== t) setTab(t);
	};

	const Tab = TAB_OPTIONS.find(({ label }) => label === tab).content;

	return (
		<section className="flex print:hidden shrink-0 flex-col items-center justify-start p-5 w-full min-h-96 border border-mercury-200 rounded-lg gap-5">

			<nav className="w-full">
				<ul className="flex items-center justify-between p-1 w-full rounded bg-mercury-100 gap-1">
					{
						TAB_OPTIONS.map(({ label, title }) =>
							<li
								key={ label }
								onClick={ () => handleTab(label) }
								className={cn(
									"flex items-center justify-center py-1 w-full rounded-sm text-sm font-medium text-mercury-800 transition-colors duration-100 cursor-pointer",
									{ 'hover:text-mercury-950': tab !== label },
									{ 'text-primary bg-mercury-50 shadow-sm cursor-default': tab === label }
								)}
							>
								{ title }
							</li>
						)
					}
				</ul>
			</nav>

			<Tab { ...{ [ tab ]: tabsData[ tab ] } } setModal={ setModal } isAdmin={ isAdmin } />

		</section>
	);
};

export default DonorTabs;