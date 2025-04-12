import { useContext } from 'react';
import { DateTime } from 'luxon';

import { GlobalState } from '@/GlobalState';

import cn from '@lib/cn';

import DonationInfo from '@sections/components/DonationInfo';

import CalendarClock from '@icons/CalendarClock';
import CircleInfo from '@icons/CircleInfo';

const DonationPending = ({ preview = false, list = false, data, isAdmin }) => {
	const {
		patientCiLetter,
		patientCi,
		patientFirstName,
		patientLastName,
		createdAt
	} = data;
	const state = useContext(GlobalState);
	const { donorAPI, modal: [ , newModal ] } = state;
	const { donations } = donorAPI;
	const { completeDonation } = donations;

	const infoHandler = data => {
		newModal({
			children: <DonationInfo data={ data } action={ completeDonation } isAdmin={ isAdmin } />
		});
	};

	return (
		<article
			className={cn(
				"flex flex-col relative w-full",
				{ 'gap-4': !list },
				{ 'p-2 border border-mercury-200 rounded': preview },
				{ 'px-3 border border-blue-200 rounded-md bg-blue-50': list }
			)}
		>

			<header
				className={cn(
					"flex items-center justify-start gap-4",
					{ 'sticky top-0 py-3 bg-blue-50': list }
				)}
			>

				<div className="flex items-center justify-center p-3 aspect-square rounded-full text-blue-500 bg-blue-100">
					<CalendarClock className='h-5 aspect-square' />
				</div>
				
				<div className="flex flex-col gap-2">
					{
						!preview && !list ?
							<span className="text-lg leading-4 font-medium">Donación programada en curso</span>
						:
							<span className="text-lg leading-4 font-medium">Donación en curso</span>
					}

					<span className="text-sm leading-3 text-mercury-600">No se puede programar otra donación</span>

				</div>
			</header>

			{
				!preview ?
					<main
						className={cn(
							"flex flex-col w-full text-blue-700 gap-3",
							{ 'p-3 border border-blue-200 rounded-md bg-blue-50': !list },
							{ 'mb-3': list } 
						)}
					>
						<div className="flex items-center gap-2">
							<span className="text-blue-800">Detalles de la donación programada</span>
							<button
								className="hover:brightness-110 transition-[filter] duration-100"
								type="button"
								title="Detalles"
								onClick={ () => infoHandler(data) }
							>
								<CircleInfo className='w-4' />
							</button>
						</div>
						<ul className="flex flex-col gap-3">
							
							<li className='list-disc list-inside'>
								<span>Fecha: <strong className="font-medium text-blue-700 select-text">{ DateTime.fromISO(createdAt).setLocale('es-VE').toLocaleString(DateTime.DATE_FULL) }</strong></span>
							</li>

							<li className='list-disc list-inside'>
								<span>Detalles del paciente:</span>
								<ul className='ml-4'>
									<li className='list-[square] list-inside'>Nombre: <strong className="font-medium text-blue-700 select-text">{ patientFirstName } { patientLastName }</strong></li>
									<li className='list-[square] list-inside'>Cédula: <strong className="font-mono font-medium text-blue-700 select-text">{ patientCiLetter } - { new Intl.NumberFormat('es-VE').format(Number(patientCi)) }</strong></li>
								</ul>
							</li>

						</ul>
					</main>
				:
					null
			}

		</article>
	);
};

export default DonationPending;