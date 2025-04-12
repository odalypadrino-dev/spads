import { useReducer, useContext } from "react";
import { DateTime } from "luxon";

import { GlobalState } from "@/GlobalState";

import cn from "@lib/cn";

import Dialog from "@components/Dialog";

import CompleteDonation from "@sections/components/CompleteDonation";

import CircleCheck from "@icons/CircleCheck";

const reducer = (current, update) => ({ ...current, ...update });

const Status = ({ className, completed }) => {
	const STATUS = {
		COMPLETED: {
			classNames: 'border-green-300 text-green-700 bg-green-100',
			label: 'Completado'
		},
		ACTIVE: {
			classNames: 'border-orange-300 text-orange-700 bg-orange-100',
			label: 'En curso'
		}
	};

	const { classNames, label } = completed ? STATUS.COMPLETED : STATUS.ACTIVE;

	return (
		<div
			className={cn(
				'flex items-center justify-center px-2 py-1 border rounded-full font-medium',
				classNames,
				className
			)}
		>
			{ label }
		</div>
	);
};

const DonationInfo = ({ data, action, isAdmin }) => {
	const [ donation, setDonation ] = useReducer(reducer, data);
	const {
		patientCiLetter,
		patientCi,
		patientFirstName,
		patientLastName,
		createdAt,
		createdBy,
		completed,
		completedBy,
		completedDate
	} = donation;

	const state = useContext(GlobalState);
	const { modal: [ , newModal ] } = state;

	const infoHandler = () => {
		newModal({
			children: <CompleteDonation data={ donation } action={ action } setDonation={ setDonation } />
		});
	};

	const info = [
		{
			key: 'date',
			label: 'Fecha',
			value: DateTime.fromISO(createdAt).setLocale('es-VE').toLocaleString({ ...DateTime.DATE_FULL, ...DateTime.TIME_SIMPLE })
		},
		{
			key: 'patient',
			label: 'Datos del paciente',
			value: <ul className="flex flex-col gap-2">
				<li className='list-disc list-inside'>Nombre: <span className="select-text">{ patientFirstName }</span></li>
				<li className='list-disc list-inside'>Apellido: <span className="select-text">{ patientLastName }</span></li>
				<li className='list-disc list-inside'>Cédula: <span className="font-mono select-text">{ patientCiLetter } - { new Intl.NumberFormat('es-VE').format(Number(patientCi)) }</span></li>
			</ul>
		},
		{
			key: 'status',
			label: 'Estado',
			value: <Status completed={ completed } className="px-3 text-sm border-none" />
		}
	];

	return (
		<Dialog className='p-7 min-w-[35vw] gap-7'>

			<div>
				<h3 className="text-lg font-semibold">Detalles de Donación</h3>
				<p className="text-sm text-mercury-700">Información detallada sobre donación</p>
			</div>

			<ul className="flex flex-col gap-7">
				{
					info.map(({ key, label, value }, ind) =>
						<li
							key={ `${ key }_${ ind }` }
							className="flex flex-col items-start justify-start gap-2"
						>
							<span className="text-sm leading-3 text-bunker-700">{ label }</span>
							<div className="leading-4 font-medium select-text">{ value }</div>
						</li>
					)
				}

				<li className="flex justify-between w-full">
					<div>
						<span className="text-sm leading-3 text-bunker-700">Programada por:</span>
						<div className="leading-4 font-medium select-text">{ createdBy.name }</div>
						<time
							dateTime={ DateTime.fromISO(createdAt).toISODate() }
							className='text-xs leading-3 text-bunker-800 italic select-text'
						>
							{
								DateTime.fromISO(createdAt).setLocale('es-VE').toLocaleString({
									...DateTime.DATETIME_SHORT,
									day: '2-digit',
									month: '2-digit'
								})
							}
						</time>
					</div>

					{
						completed ?
							<div>
								<span className="text-sm leading-3 text-bunker-700">Completada por:</span>
								<div className="leading-4 font-medium select-text">{ completedBy.name }</div>
								<time
									dateTime={ DateTime.fromISO(completedDate).toISODate() }
									className='text-xs leading-3 text-bunker-800 italic select-text'
								>
									{
										DateTime.fromISO(completedDate).setLocale('es-VE').toLocaleString({
											...DateTime.DATETIME_SHORT,
											day: '2-digit',
											month: '2-digit'
										})
									}
								</time>
							</div>
						:
							null
					}
				</li>
			</ul>

			{
				!completed && !isAdmin ?
					<button
						type="button"
						className={cn(
							"flex items-center justify-center py-3 w-full rounded-xl text-secondary bg-primary gap-5",
							"hover:contrast-[.85] transition-[filter] duration-100"
						)}
						onClick={ infoHandler }
					>
						<CircleCheck className='w-4' /> Completar donación
					</button>
				:
					null
			}

		</Dialog>
	);
};

export default DonationInfo;