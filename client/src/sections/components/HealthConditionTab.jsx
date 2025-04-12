import { useState, useEffect, useContext, useReducer } from "react";
import { useParams } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Pagination } from "@heroui/react";
import toast from "react-hot-toast";
import { DateTime } from "luxon";

import { GlobalState } from "@/GlobalState";

import cn from "@lib/cn";

import useScrollLock from "@hooks/useScrollLock";

import Dialog from "@components/Dialog";
import Fieldset from "@components/Fieldset";
import Form from "@components/Form";
import Loading from "@components/Loading";
import Message from "@components/Message";

import HCInfo from "@sections/components/HCInfo";
import Status from "@sections/components/Status";

import DONOR from "@consts/donor";

import CalendarDay from "@icons/CalendarDay";
import CircleInfo from "@icons/CircleInfo";
import Directions from "@icons/Directions";
import Heart from "@icons/Heart";
import Notebook from "@icons/Notebook";
import Plus from "@icons/Plus";

const hcColumns = [
	{
		key: 'type',
		label: 'Tipo'
	},
	{
		key: 'date',
		label: 'Fecha'
	},
	{
		key: 'status',
		label: 'Estado'
	},
	{
		key: 'details',
		label: 'Detalles'
	}
];

const INIT_ADD_HC = {
	type: '',
	date: '',
	ended: false,
	endDate: '',
	dueTo: ''
};

const reducer = (current, update) => ({ ...current, ...update });

const AddHC = ({ action, refresh }) => {
	const { unlockScroll } = useScrollLock(true);
	const params = useParams();
	const state = useContext(GlobalState);
	const { modal: [ ,, closeModal ], loadingModal: [ loading, setLoading ], handlers } = state;
	const [ hdls ] = handlers;
	const refreshDS = hdls.find(({ key }) => key === 'donationStatus').action;
	const [ hcData, setHCData ] = useReducer(reducer, INIT_ADD_HC);

	const onChange = e => {
		const { name, value } = e.target;

		setHCData({
			[ name ]: name === 'ended' ? !hcData.ended : value,
			...(name === 'ended' ? { endDate: '', dueTo: '' } : {}),
			...(name === 'type' ? { date: '', ended: false, endDate: '', dueTo: '' } : {})
		});
	};

	const cancelHandler = () => {
		if (loading) return;
		unlockScroll();
		closeModal();
	};

	const selectedType = DONOR.HEALTH_CONDITIONS.entities[ hcData.type ];

	const formValid = Object.entries(hcData).every(([ key, value ]) => {
		if (key === 'type') return value;

		if ([ 1, 3, 4 ].includes(selectedType?.level)) {
			if (key === 'date') return value;
		};

		if (selectedType?.level === 3) {
			if (key === 'endDate' && hcData.dueTo) return value;
			if (key === 'dueTo' && hcData.endDate) return value;
		};

		return true;
	});

	const onSubmit = async e => {
		e.preventDefault();

	    if (loading) return;

		if (!formValid) {
			const { type, date, ended, endDate, dueTo  } = hcData;

			if (!type) return toast.error('El tipo de condición de salud es obligatorio.');
			if ([ 1, 3, 4 ].includes(selectedType.level) && !date) return toast.error('La fecha para este tipo de condición de salud es obligatoria.');
			if (selectedType.level === 2 && selectedType.time && ended && !endDate) return toast.error('La fecha de finalización es requerida.');
			if (selectedType.level === 3) {
				if (ended) {
					if (!endDate) return toast.error('La fecha de finalización es requerida.');
					if (!dueTo) return toast.error('El motivo de finalización es requerido.');
				};

				if (endDate) {
					if (!ended) return toast.error('Acción inválida.');
					if (!dueTo) return toast.error('El motivo de finalización es requerido.');
				};
				
				if (dueTo) {
					if (!ended) return toast.error('Acción inválida.');
					if (!endDate) return toast.error('La fecha de finalización es requerida.');
				};
			};
		};

        setLoading(true);

		try {
			const { status, success, content } = await action(params.id, hcData);

			if (status === 500) {
				setLoading(false);
				return toast.error("Error en el servidor.");
			};

			if (!success) {
				setLoading(false);
				closeModal();
				return toast.error(content);
			};

			if (success) {
				unlockScroll();
				closeModal();
				setLoading(false);
				refresh();
				refreshDS();
				toast.success(content);
			};

		} catch (err) {
			const { response: { data } } = err;
			const { success, content } = data;
			
			setLoading(false);
			if (!success) return toast.error(content);
		};
	};

	return (
		<Dialog className='min-w-[42vw] h-[80vh] gap-7 overflow-visible'>

			<Dialog.Header>
				<Dialog.Header.Title>Añadir Condición de Salud</Dialog.Header.Title>
			</Dialog.Header>

			<Form onSubmit={ onSubmit } className='justify-between gap-7' data-invalid={ !formValid }>
				
				<Fieldset
					classNames={{
						base: 'px-7',
						content: 'mt-0 gap-5'
					}}
				>

					<Fieldset.Field>

						<Fieldset.Field.Container>
							<Fieldset.Field.Container.Dropdown
								{...{
									label: 'Tipo',
									name: 'type',
									selected: selectedType?.label,
									items: Object.values(DONOR.HEALTH_CONDITIONS.entities).sort((a, b) => a.label !== b.label ? a.label < b.label ? -1 : 1 : 0)
										.map(({ type, label }) => ({ value: String(type), label })),
									decorator: <Heart />,
									onChange: e => onChange({ target: e }),
									'aria-disabled': loading,
									'aria-required': true
								}}
							/>
						</Fieldset.Field.Container>

					</Fieldset.Field>

					<Fieldset.Field>

						<Fieldset.Field.Container label='Fecha' htmlFor='date' hasDecorator>

							<Fieldset.Field.Container.Input
								className='filled'
								type="date"
								name="date"
								id="date"
								value={ hcData.date }
								onChange={ onChange }
								disabled={ loading }
								required={ [ 1, 3, 4 ].includes(selectedType?.level) }
								max={ new Date().toLocaleDateString('en-ca') }
							/>
								
							<CalendarDay />

						</Fieldset.Field.Container>

					</Fieldset.Field>

					{
						[ 2, 3 ].includes(selectedType?.level) ?
							<Fieldset.Field>
								<Fieldset.Field.Container classNames={{ base: 'gap-2' }}>
									<Fieldset.Field.Container.Checkbox
										label='Finalizado'
										htmlFor='ended'
										name='ended'
										id='ended'
										checked={ hcData.ended }
										onChange={ onChange }
										disabled={ loading }
									/>
								</Fieldset.Field.Container>
							</Fieldset.Field>
						:
							null
					}

					{
						hcData.ended ?
							<Fieldset.Field>

								<Fieldset.Field.Container label='Fecha de finalización' htmlFor='endDate' hasDecorator>

									<Fieldset.Field.Container.Input
										className='filled'
										type="date"
										name="endDate"
										id="endDate"
										value={ hcData.endDate }
										onChange={ onChange }
										disabled={ loading }
										required={ !(selectedType.level === 2 && !selectedType?.time) }
										max={ new Date().toLocaleDateString('en-ca') }
									/>
										
									<CalendarDay />

								</Fieldset.Field.Container>

							</Fieldset.Field>
						:
							null
					}

					{
						hcData.ended && selectedType.level === 3 ?
							<Fieldset.Field>
		
								<Fieldset.Field.Container>
									<Fieldset.Field.Container.Dropdown
										{...{
											label: 'Motivo',
											name: 'dueTo',
											selected: selectedType.dueToOpts[ hcData.dueTo ]?.value,
											items: Object.values(selectedType.dueToOpts).map(({ id, value }) => ({ value: String(id), label: value })),
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

				<Dialog.Buttons>

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
						icon={ <Plus className='w-4' /> }
						isLoading={ loading }
					>
						Añadir Condición
					</Dialog.Buttons.Accept>

				</Dialog.Buttons>

			</Form>

		</Dialog>
	);
};

const HealthConditionTab = ({ healthConditions, setModal, isAdmin }) => {
	const params = useParams();
	const { addHealthCondition, getHealthConditions, endHealthCondition } = healthConditions;
	const state = useContext(GlobalState);
	const { handlers } = state;
	const [ hdl, newHandler ] = handlers;
	const [ loading, setLoading ] = useState(true);
	const [ hcs, setHCs ] = useState(null);
	const [ page, setPage ] = useState(1);

	const fetchHCs = async signal => {
		setLoading(true);

		const { status, success, content } = await getHealthConditions(params.id, signal, { page });

		if (status === 500) {
			toast.error("Error en el servidor.");
			return navigate('/');
		};

		if (!success && !content.data) {
			toast.error(content);
			return navigate('/');
		};

		setHCs(content);
		setLoading(false);
	};

	useEffect(() => {
		const fetch = new AbortController();
		if (params) fetchHCs(fetch);

		if (hdl.every(({ id }) => id !== 'fetchHCs')) newHandler({
			key: 'hc',
			id: 'fetchHCs',
			action: fetchHCs
		});

		return () => fetch.abort();
	}, [ page ]);

	const addHandler = () => {
		setModal({
			children: <AddHC action={ addHealthCondition } refresh={ fetchHCs } />,
			props: { hasCloseBtn: false }
		});
	};

	const infoHandler = data => {
		setModal({
			children: <HCInfo data={ data } action={ endHealthCondition } isAdmin={ isAdmin } />
		});
	};
	
	return (
		<article className="flex flex-col items-start justify-start w-full h-full gap-5">

			<header className="flex items-center justify-between w-full">

				<div>
					<h3 className="text-xl font-semibold">Condiciones de salud</h3>
					<p className="text-sm text-mercury-700">Condiciones médicas que pueden afectar la elegibilidad para donar</p>
				</div>

				{
					!isAdmin ?
						<button 
							type="button"
							className={cn(
								"flex items-center justify-center px-5 py-3 rounded-lg text-sm text-secondary bg-primary gap-5",
								"[&:not(:disabled)]:hover:contrast-[.85] transition-[filter] duration-100",
								"disabled:opacity-70 disabled:cursor-not-allowed"
							)}
							onClick={ addHandler }
							disabled={ loading }
						>
							<Plus className='w-4' />
							Añadir Condición
						</button>
					:
						null
				}

			</header>

			{
				!loading ?
					hcs.quantity ?
						<div className="w-full h-full">
							<Table
								isHeaderSticky
								radius="sm"
								aria-label="Condiciones de salud"
								bottomContent={
									hcs.quantity > 6 ?
										<Pagination
											showControls
											showShadow={ false }
											isCompact
											radius='sm'
											total={ Math.ceil(hcs.quantity / 6) }
											page={ page }
											onChange={ setPage }
											color='primary'
										/>
									:
										null
								}
							>
								<TableHeader columns={ hcColumns }>
									{ col => <TableColumn key={ col.key }>{ col.label }</TableColumn> }
								</TableHeader>

								<TableBody items={ hcs.data }>
									{
										hc => {
											const { id, label, date } = hc;

											return (
												<TableRow key={ `${ id }_${ date }_${ label }` }>

													<TableCell>{ label }</TableCell>

													<TableCell className="font-mono">
														{
															date ?
																DateTime.fromISO(date).setLocale('es-VE')
																	.toLocaleString({
																		day:'2-digit',
																		month:'2-digit',
																		year:'numeric'
																	})
															:
																'No especificado'
														}
													</TableCell>

													<TableCell>
														<Status data={ hc } />
													</TableCell>

													<TableCell className="flex items-center justify-center">
														<button
															className="text-bunker-600 hover:brightness-125 transition-[filter] duration-100"
															type="button"
															title="Detalles"
															onClick={ () => infoHandler(hc) }
														>
															<CircleInfo />
														</button>
													</TableCell>

												</TableRow>
											);
										}
									}
								</TableBody>
							</Table>
						</div>
					:
						<Message>

							<Message.Icon>
								<Notebook />
							</Message.Icon>

							<Message.Description>{ hcs.data }</Message.Description>

						</Message>
				:
					<div className="flex items-center justify-center w-full h-full">
						<Loading size="100" color='var(--color-primary)' stroke="5" />
					</div>
			}

		</article>
	);
};

export default HealthConditionTab;