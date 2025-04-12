import { useState, useContext, useReducer } from "react";
import { useParams } from 'react-router-dom';
import toast from "react-hot-toast";
import { DateTime } from "luxon";

import { GlobalState } from "@/GlobalState";

import cn from "@lib/cn";
import getStatus from "@lib/getStatus";

import Dialog from "@components/Dialog";
import Fieldset from "@components/Fieldset";
import Form from "@components/Form";

import Status from "@sections/components/Status";

import DONOR from "@consts/donor";
import TIME_UNITS from "@consts/time";

import CalendarDay from "@icons/CalendarDay";
import Directions from "@icons/Directions";
import FloppyDisk from "@icons/FloppyDisk";

const INIT_END_DATE = {
	endDate: '',
	dueTo: ''
};

const reducer = (current, update) => ({ ...current, ...update });

const HCInfo = ({ data, action, isAdmin }) => {
	const params = useParams();
	const [ hc, setHC ] = useReducer(reducer, data);
	const {
		id,
		type,
		level,
		label,
		date,
		time,
		createdAt,
		createdBy,
		ended,
		endDate,
		endDateTime,
		dueTo,
		endedBy
	} = hc;
	
	const state = useContext(GlobalState);
	const { loadingModal: [ loading, setLoading ], handlers } = state;
	const [ hdls ] = handlers;
	const hcHandlers = hdls.filter(({ key }) => key === 'hc' || key === 'donationStatus');
	const [ end, setEnd ] = useState(false);
	const [ endData, setEndData ] = useReducer(reducer, INIT_END_DATE);

	const status = getStatus(hc);
	const timeUnit = TIME_UNITS[ time?.unit ];

	const detailedType = DONOR.HEALTH_CONDITIONS.entities[ type ];

	const formValid = Object.entries(endData).every(([ key, value ]) => {
		if (![ 2, 3 ].includes(level)) return false;

		if (level === 2) {
			if (time && key === 'endDate') return value;
			
			return true;
		};

		return value;
	});

	const info = [
		{
			key: 'type',
			label: 'Tipo',
			value: label
		},
		{
			key: 'date',
			label: 'Fecha',
			value: date ? DateTime.fromISO(date).setLocale('es-VE').toLocaleString(DateTime.DATE_FULL) : 'No especificado'
		},
		...(
			!end ?
				[
					{
						key: 'status',
						label: 'Estado actual',
						value: <Status data={ hc } className="px-3 text-sm border-none" />
					}
				]
			:
				[]
		),
		...(
			ended ?
				[
					{
						key: 'endDate',
						label: 'Fecha de finalización',
						value: endDate ? DateTime.fromISO(endDate).setLocale('es-VE').toLocaleString(DateTime.DATE_FULL) : 'No especificado'
					},
					...(
						dueTo ?
							[
								{
									key: 'dueTo',
									label: 'Motivo',
									value: dueTo.value
								}
							]
						:
							[]
					)
				]
			:
				[]
		),
		...(
			status.status === 'WAITING' ?
				[
					{
						key: 'waiting',
						label: 'Periodo de espera',
						value: `${ time.value } ${ time.value > 1 ? timeUnit.plural : timeUnit.singular }`
					},
					{
						key: 'until',
						label: 'Esperar hasta el',
						value: status.until
					}
				]
			:
				[]
		)
	];

	const onChange = e => {
		const { name, value } = e.target;

		setEndData({
			[ name ]: value,
		});
	};

	const cancelHandler = () => {
		if (loading) return;
		setEndData(INIT_END_DATE);
		setEnd(false);
	};

	const onSubmit = async e => {
		e.preventDefault();

	    if (loading) return;

		if (!formValid) {
			const { endDate, dueTo } = endData;
			
			if (level === 2 && time && !endDate) return toast.error('La fecha de finalización es requerida.');
			if (level === 3) {
				if (!endDate) return toast.error('La fecha de finalización es requerida.');
				if (!dueTo) return toast.error('El motivo de finalización es requerido.');
			};
		};

        setLoading(true);

		try {
			const { status, success, content } = await action(params.id, id, endData);

			if (status === 500) {
				setLoading(false);
				return toast.error("Error en el servidor.");
			};

			if (!success) {
				setLoading(false);
				setEndData(INIT_END_DATE);
				setEnd(false);
				return toast.error(content);
			};

			if (success) {
				setEnd(false);
				setLoading(false);
				setHC(content.data);

				for (let i = 0; i < hcHandlers.length; i++) {
					const { action } = hcHandlers[i];
					action();
				};

				toast.success(content.message);
			};

		} catch (err) {
			const { response: { data } } = err;
			const { success, content } = data;
			
			setLoading(false);
			if (!success) return toast.error(content);
		};
	};

	return (
		<Dialog className='p-7 min-w-[35vw] gap-7'>

			<div>
				<h3 className="text-lg font-semibold">Condición de salud</h3>
				<p className="text-sm text-mercury-700">Información detallada sobre esta condición médica</p>
			</div>

			<ul className="flex flex-col gap-7 overflow-y-auto">
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

				{
					!end ?
						<li className="flex justify-between w-full">
							<div>
								<span className="text-sm leading-3 text-bunker-700">Registrada por:</span>
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
								ended ?
									<div>
										<span className="text-sm leading-3 text-bunker-700">Finalizada por:</span>
										<div className="leading-4 font-medium select-text">{ endedBy.name }</div>
										<time
											dateTime={ DateTime.fromISO(endDateTime).toISODate() }
											className='text-xs leading-3 text-bunker-800 italic select-text'
										>
											{
												DateTime.fromISO(endDateTime).setLocale('es-VE').toLocaleString({
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
					:
						null
				}
			</ul>

			{
				[ 2, 3 ].includes(level) && !ended && !end && !isAdmin ?
					<div className="flex justify-end w-full">
						<button 
							type="button"
							className={cn(
								"flex items-center justify-center px-5 py-3 rounded-lg text-sm text-secondary bg-primary gap-5",
								"[&:not(:disabled)]:hover:contrast-[.85] transition-[filter] duration-100",
								"disabled:opacity-70 disabled:cursor-not-allowed"
							)}
							onClick={ () => setEnd(true) }
							disabled={ loading }
						>
							Finalizar
						</button>
					</div>
				:
					null
			}

			{
				end ?
					<Form onSubmit={ onSubmit } className='justify-between gap-7' data-invalid={ !formValid }>

						<Fieldset
							classNames={{
								content: 'mt-0 gap-5'
							}}
						>

							<Fieldset.Field>

								<Fieldset.Field.Container label='Fecha de finalización' htmlFor='endDate' hasDecorator>

									<Fieldset.Field.Container.Input
										className='filled'
										type="date"
										name="endDate"
										id="endDate"
										value={ endData.endDate }
										onChange={ onChange }
										disabled={ loading }
										required={ !(level === 2 && !time) }
										max={ new Date().toLocaleDateString('en-ca') }
									/>
										
									<CalendarDay />

								</Fieldset.Field.Container>

							</Fieldset.Field>

							{
								level === 3 ?
									<Fieldset.Field>
				
										<Fieldset.Field.Container>
											<Fieldset.Field.Container.Dropdown
												{...{
													label: 'Motivo',
													name: 'dueTo',
													selected: detailedType.dueToOpts[ endData.dueTo ]?.value,
													items: Object.values(detailedType.dueToOpts).map(({ id, value }) => ({ value: String(id), label: value })),
													decorator: <Directions />,
													onChange: e => onChange({ target: e }),
													'aria-disabled': loading,
													'aria-required': true
												}}
											/>
										</Fieldset.Field.Container>
				
									</Fieldset.Field>
								:
									null
							}

						</Fieldset>

						<Dialog.Buttons className='pb-0'>
	
							<Dialog.Buttons.Cancel
								onClick={ cancelHandler }
								isDisabled={ loading }
							>
								Cancelar
							</Dialog.Buttons.Cancel>
	
							<Dialog.Buttons.Accept
								type='submit'
								classNames={{
									base: 'text-secondary',
									loading: { color: 'var(--color-secondary)' }
								}}
								icon={ <FloppyDisk className='w-4' /> }
								isLoading={ loading }
							>
								Confirmar
							</Dialog.Buttons.Accept>
	
						</Dialog.Buttons>

					</Form>
				:
					null
			}

		</Dialog>
	);
};

export default HCInfo;