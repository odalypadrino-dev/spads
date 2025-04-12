import { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import toast from "react-hot-toast";

import { GlobalState } from "@/GlobalState";

import cn from "@lib/cn";

import AddDonation from "@sections/components/AddDonation";

import Award from "@icons/Award";
import Clock from "@icons/Clock";
import Heart from "@icons/Heart";
import CalendarDays from "@icons/CalendarDays";
import { DateTime } from "luxon";

const CanDonate = ({ donationsHandlers, refresh, isAdmin }) => {
	const params = useParams();
	const state = useContext(GlobalState);
	const { modal: [ , newModal ] } = state;
	const { addDonation, getDonations, donAvail } = donationsHandlers;
	const [ donations, setDonations ] = useState(null);

	const fetchDonations = async signal => {
		const { status, success, content } = await getDonations(params.id, signal);

		if (status === 500) {
			toast.error("Error en el servidor.");
			return navigate('/');
		};

		if (!success && !content.data) {
			toast.error(content);
			return navigate('/');
		};

		setDonations(content);
	};

	useEffect(() => {
		const fetch = new AbortController();
		if (params) fetchDonations(fetch);

		return () => fetch.abort();
	}, []);

	const action = async donationData => {
		const canDonate = await donAvail(params.id, true);

		if (canDonate.status === 500) return {
			status: 500,
			success: false,
			content: "Error en el servidor."
		};

		if (!canDonate.success) return {
			status: 400,
			success: false,
			content: canDonate.content
		};

		const payload = canDonate.content;

		const { status, success, content } = await addDonation(params.id, {
			token: payload,
			...donationData
		});

		if (status === 500) return {
			status: 500,
			success: false,
			content: "Error en el servidor."
		};

		if (!success) return {
			status: 400,
			success: false,
			content
		};

		return {
			status: 200,
			success: true,
			content
		};
	};

	const handleClick = () => {
		newModal({
			children: <AddDonation action={ action } refresh={ refresh } />,
			props: { hasCloseBtn: false }
		});
	};

	return (
		<div className="flex flex-col w-full gap-4">

			<div className="flex items-center gap-3">

				<div className="flex items-center justify-center p-3 aspect-square rounded-full text-green-500 bg-green-100">
					<Heart className='h-5 aspect-square' />
				</div>

				<div>
					<span className="text-lg leading-4 font-medium">Elegible para donar</span>
					<p className="text-sm leading-3 text-mercury-600">Todos los criterios cumplidos</p>
				</div>
			</div>

			<div className="flex items-center gap-4">

				<div className="flex items-center gap-3">
	
					<div className="flex items-center justify-center p-3 aspect-square rounded-full text-purple-500 bg-purple-100">
						<Award className='h-5 aspect-square' />
					</div>
	
					<div>
						<span className="text-lg leading-4 font-medium">Total donaciones</span>
						<p className="text-sm leading-3 text-mercury-600"><span className="font-mono font-bold">{ donations?.quantity || 0 }</span> donaciones realizadas</p>
					</div>
				</div>

				<div className="flex items-center gap-3">

					<div className="flex items-center justify-center p-3 aspect-square rounded-full text-amber-500 bg-amber-100">
						<Clock className='h-5 aspect-square' />
					</div>

					<div>
						<span className="text-lg leading-4 font-medium">Ultima donación</span>
						<p className="text-sm leading-3 text-mercury-600">
							{
								donations?.quantity ?
									DateTime.fromISO(donations.data[0].createdAt).setLocale('es-VE').toLocaleString(DateTime.DATE_FULL)
								:
									'Aun no hay donaciones realizadas por este donante'
							}
						</p>
					</div>
				</div>

			</div>

			{
				!isAdmin ?
					<button
						type="button"
						className={cn(
							"flex items-center justify-center py-3 w-full rounded-xl text-secondary bg-primary gap-5",
							"hover:contrast-[.85] transition-[filter] duration-100"
						)}
						onClick={ handleClick }
					>
						<CalendarDays className='w-4' /> Programar donación
					</button>
				:
					null
			}

		</div>
	);
};

export default CanDonate;