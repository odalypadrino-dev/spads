import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import toast from "react-hot-toast";

import { GlobalState } from "@/GlobalState";

import cn from '@lib/cn';

import Dialog from "@components/Dialog";
import Loading from "@components/Loading";

import AgeInvalid from "@sections/components/AgeInvalid";
import CanDonate from "@sections/components/CanDonate";
import HCInvalids from "@sections/components/HCInvalids";
import NoBloodType from "@sections/components/NoBloodType";
import BloodTestInvalid from "@sections/components/BloodTestInvalid";
import WeightInvalid from "@sections/components/WeightInvalid";
import DonationPending from "@sections/components/DonationPending";
import DonationWaiting from "@sections/components/DonationWaiting";

import CircleExclamation from "@icons/CircleExclamation";
import FileLines from "@icons/FileLines";

const ERROR_VIEWS = {
	'1': {
		View: NoBloodType
	},
	'2': {
		View: BloodTestInvalid
	},
	'3': {
		View: AgeInvalid
	},
	'4': {
		View: WeightInvalid
	},
	'5': {
		View: HCInvalids
	},
	'6': {
		View: DonationPending
	},
	'7': {
		View: DonationWaiting
	}
};

const DueToList = ({ dueTo }) => {
	return (
		<Dialog className='p-7 min-w-[50vw] gap-7'>
			
			<div>
				<h3 className="text-lg font-semibold">Detalles de elegibilidad</h3>
				<p className="text-sm text-mercury-700">Información detallada sobre los problemas que afectan la elegibilidad para donar</p>
			</div>

			<div className="flex flex-col w-full gap-4 overflow-y-auto">
				{
					dueTo.map((dT, ind) => {
						const { type, data } = dT;
						const { View } = ERROR_VIEWS[ type ];

						return <View key={ ind } data={ data } list />;
					})
				}
			</div>

		</Dialog>
	);
};

const MultiErrors = ({ dueTo, setModal }) => {
	const [ first, second, ...rest ] = dueTo;
	const preview = [ first, second ];

	const handleClick = () => {
		setModal({
			hasCloseBtn: true,
			children: <DueToList dueTo={ dueTo } />
		});
	};

	return (
		<article
			className={cn(
				"flex flex-col w-full gap-4",
			)}
		>

			<header className="flex items-center justify-start gap-4">

				<div className="flex items-center justify-center p-3 aspect-square rounded-full text-red-500 bg-red-100">
					<CircleExclamation className='h-5 aspect-square' />
				</div>
				
				<div className="flex flex-col gap-2">
					<span className="text-lg leading-4 font-medium">No elegible para donar</span>
					<span className="print:hidden text-sm leading-3 text-mercury-600">{ dueTo.length } problemas detectados</span>
				</div>
			</header>

			<main className="w-full">

				<ul className="flex flex-col gap-3">
					{
						preview.map((p, ind) => {
							const { type, data } = p;
							const { View } = ERROR_VIEWS[ type ];
							return (
								<li key={ ind }>
									<View preview data={ data } />
								</li>
							);
						})
					}
				</ul>
				
				{ 
					rest.length ?
						<span className="inline-flex print:hidden justify-center mt-4 w-full text-mercury-600">
							+ { rest.length } { rest.length > 1 ? 'problemas adicionales' : 'problema adicional' }
						</span>
					:
						null
				}

				<button
					type="button"
					className={cn(
						"flex print:hidden items-center justify-center mt-5 py-3 w-full rounded-xl text-secondary bg-primary gap-5",
						"hover:contrast-[.85] transition-[filter] duration-100"
					)}
					onClick={ handleClick }
				>
					<FileLines className='w-4' /> Ver Detalles Completos
				</button>
			</main>

		</article>
	);
};

const DonationStatus = ({ donations, isAdmin }) => {
	const navigate = useNavigate();
	const params = useParams();
	const state = useContext(GlobalState);
	const { modal: [ , setModal ], handlers } = state;
	const [ hdl, newHandler ] = handlers;
	const { donAvail } = donations;
	const [ canDonate, setCanDonate ] = useState(null);
	const [ loading, setLoading ] = useState(true);

	const fetchDonAvail = async () => {
		setLoading(true);

		const { status, success, content } = await donAvail(params.id);

		if (status === 500) {
			toast.error("Error en el servidor.");
			return navigate('/');
		};

		if (!success) {
			toast.error(content);
			return navigate('/');
		};

		setCanDonate(content);
		setLoading(false);
	};

	useEffect(() => {
		if (!canDonate && params) fetchDonAvail();
		
		newHandler({
			key: 'donationStatus',
			id: 'fetchDonAvail',
			action: fetchDonAvail
		});
	}, []);

	if (loading) return (
		<section className="flex flex-col items-center justify-center p-5 w-full min-h-60 border border-mercury-200 rounded-lg">
			<Loading size="100" color='var(--color-primary)' stroke="5" />
		</section>
	);

	const { status, dueTo } = canDonate;

	const View = dueTo.length === 1 ? ERROR_VIEWS[ dueTo[0].type ].View : null;

	return (
		<section className="flex shrink-0 flex-col items-start justify-start p-5 w-full min-h-60 border border-mercury-200 rounded-lg gap-5">

			<div>
				<h3 className="text-xl font-semibold">Estado de Donación</h3>
				<p className="text-sm text-mercury-700">Elegibilidad y detalles de donación</p>
			</div>

			{
				status ?
					<CanDonate
						donationsHandlers={ donations }
						refresh={ fetchDonAvail }
						isAdmin={ isAdmin }
					/>
				:
					dueTo.length === 1 ?
						<View data={ dueTo[0].data } isAdmin={ isAdmin } />
					:
						<MultiErrors dueTo={ dueTo } setModal={ setModal } />
			}

		</section>
	);
};

export default DonationStatus;