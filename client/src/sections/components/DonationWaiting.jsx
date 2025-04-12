import { useContext } from 'react';
import { DateTime, Interval } from 'luxon';

import { GlobalState } from '@/GlobalState';

import cn from '@lib/cn';

import DonationInfo from '@sections/components/DonationInfo';

import DONOR from '@consts/donor';

import CircleInfo from '@icons/CircleInfo';
import Clock from '@icons/Clock';
	
const getInterval = (start, end) => {
	const interval = Interval.fromDateTimes(start, end);
	
	const UNITS = [
		{
			unit: 'months',
			label: {
				singular: 'mes',
				plural: 'meses'
			}
		},
		{
			unit: 'days',
			label: {
				singular: 'día',
				plural: 'días'
			}
		},
		{
			unit: 'hours',
			label: {
				singular: 'hora',
				plural: 'horas'
			}
		},
		{
			unit: 'minutes',
			label: {
				singular: 'minuto',
				plural: 'minutos'
			}
		},
		{
			unit: 'seconds',
			label: {
				singular: 'segundo',
				plural: 'segundos'
			}
		}
	];

	for (let i = 0; i < UNITS.length; i++) {
		const unit = UNITS[ i ];
		const duration = interval.toDuration([ unit.unit, 'milliseconds' ]).toObject();

		const elapsedTime = duration[ unit.unit ];

		if (elapsedTime >= 1) return [ elapsedTime, unit.label.singular, unit.label.plural ];
	};
};

const DonationWaiting = ({ preview = false, list = false, data }) => {
	const { createdAt, completedDate } = data;
	const state = useContext(GlobalState);
	const { modal: [ , newModal ] } = state;

	const infoHandler = data => {
		newModal({
			children: <DonationInfo data={ data } />
		});
	};

	const currentTime = DateTime.now();

	
	const [ elapsedTime, singular, plural ] = getInterval(DateTime.fromISO(completedDate), currentTime);

	const [ timeLeft, singularLeft, pluralLeft ] = getInterval(currentTime, currentTime.plus({ [ DONOR.DONATIONS.time.unit ]: DONOR.DONATIONS.time.value }));

	return (
		<article
			className={cn(
				"flex flex-col relative w-full",
				{ 'gap-4': !list },
				{ 'p-2 border border-mercury-200 rounded': preview },
				{ 'px-3 border border-amber-200 rounded-md bg-amber-50': list }
			)}
		>

			<header
				className={cn(
					"flex items-center justify-start gap-4",
					{ 'sticky top-0 py-3 bg-amber-50': list }
				)}
			>

				<div className="flex items-center justify-center p-3 aspect-square rounded-full text-amber-500 bg-amber-100">
					<Clock className='h-5 aspect-square' />
				</div>
				
				<div className="flex flex-col gap-2">
					{
						!preview && !list ?
							<span className="text-lg leading-4 font-medium">No elegible por donación reciente</span>
						:
							<span className="text-lg leading-4 font-medium">Donación reciente</span>
					}

					<span className="text-sm leading-3 text-mercury-600">Debe esperar el periodo mínimo entre donaciones</span>

				</div>
			</header>

			{
				!preview ?
					<main
						className={cn(
							"flex flex-col w-full text-amber-700 gap-3",
							{ 'p-3 border border-amber-200 rounded-md bg-amber-50': !list },
							{ 'mb-3': list } 
						)}
					>
						<div className="flex items-center gap-2">
							<span className="text-amber-800">Ultima donación: { DateTime.fromISO(createdAt).setLocale('es-VE').toLocaleString(DateTime.DATE_FULL) }</span>
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
								<span>Tiempo transcurrido desde la ultima donación: <strong className="font-medium text-amber-700 select-text">{ elapsedTime } { elapsedTime > 1 ? plural : singular }</strong></span>
							</li>
							
							<li className='list-disc list-inside'>
								<span>Tiempo restante para poder realizar otra donación: <strong className="font-medium text-amber-700 select-text">{ timeLeft } { timeLeft > 1 ? pluralLeft : singularLeft }</strong></span>
							</li>

						</ul>
					</main>
				:
					null
			}

		</article>
	);
};

export default DonationWaiting;