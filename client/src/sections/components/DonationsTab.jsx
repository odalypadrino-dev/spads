import { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Pagination } from "@heroui/react";
import toast from "react-hot-toast";
import { DateTime } from "luxon";

import { GlobalState } from "@/GlobalState";

import cn from "@lib/cn";

import Loading from "@components/Loading";
import Message from "@components/Message";

import DonationInfo from "@sections/components/DonationInfo";

import CircleInfo from "@icons/CircleInfo";
import Notebook from "@icons/Notebook";

const DonationColumns = [
	{
		key: 'date',
		label: 'Fecha'
	},
	{
		key: 'patientName',
		label: 'Nombre del Paciente'
	},
	{
		key: 'patientCI',
		label: 'Cédula del Paciente'
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

const DonationsTab = ({ donations: dnts, setModal, isAdmin }) => {
	const params = useParams();
	const { getDonations } = dnts;
	const state = useContext(GlobalState);
	const { handlers } = state;
	const [ hdl, newHandler ] = handlers;
	const [ loading, setLoading ] = useState(true);
	const [ donations, setDonations ] = useState(null);
	const [ page, setPage ] = useState(1);

	const fetchDonations = async signal => {
		setLoading(true);

		const { status, success, content } = await getDonations(params.id, signal, { page });

		if (status === 500) {
			toast.error("Error en el servidor.");
			return navigate('/');
		};

		if (!success && !content.data) {
			toast.error(content);
			return navigate('/');
		};

		setDonations(content);
		setLoading(false);
	};

	useEffect(() => {
		newHandler({
			key: 'donation',
			id: 'fetchDonations',
			action: fetchDonations
		});
	}, []);

	useEffect(() => {
		const fetch = new AbortController();
		if (params) fetchDonations(fetch);

		return () => fetch.abort();
	}, [ page ]);
	
	const infoHandler = data => {
		setModal({
			children: <DonationInfo data={ data } isAdmin={ isAdmin } />
		});
	};

	return (
		<article className="flex flex-col items-start justify-start w-full h-full gap-5">

			<header className="flex items-center justify-between w-full">

				<div>
					<h3 className="text-xl font-semibold">Donaciones</h3>
					<p className="text-sm text-mercury-700">Donaciones de sangre realizadas por el donante</p>
				</div>

			</header>

			{
				!loading ?
					donations.quantity ?
						<div className="w-full h-full">
							<Table
								isHeaderSticky
								radius="sm"
								aria-label="Exámenes de sangre"
								bottomContent={
									donations.quantity > 6 ?
										<Pagination
											showControls
											showShadow={ false }
											isCompact
											radius='sm'
											total={ Math.ceil(donations.quantity / 6) }
											page={ page }
											onChange={ setPage }
											color='primary'
										/>
									:
										null
								}
							>
								<TableHeader columns={ DonationColumns }>
									{ col => <TableColumn key={ col.key }>{ col.label }</TableColumn> }
								</TableHeader>

								<TableBody items={ donations.data }>
									{
										donation => {
											const {
												id,
												patientFirstName,
												patientLastName,
												patientCiLetter,
												patientCi,
												completed,
												createdAt
											} = donation;

											return (
												<TableRow key={ `${ id }_${ createdAt }` }>

													<TableCell className="font-mono">
														{
															DateTime.fromISO(createdAt).setLocale('es-VE')
																.toLocaleString({
																	...DateTime.DATE_FULL,
																	...DateTime.TIME_SIMPLE
																})
														}
													</TableCell>

													<TableCell>
														{ patientFirstName } { patientLastName }
													</TableCell>

													<TableCell>
														{ patientCiLetter } - { new Intl.NumberFormat('es-VE').format(Number(patientCi)) }
													</TableCell>

													<TableCell>
														<Status completed={ completed } />
													</TableCell>

													<TableCell className="flex items-center justify-center">
														<button
															className="text-bunker-600 hover:brightness-125 transition-[filter] duration-100"
															type="button"
															title="Detalles"
															onClick={ () => infoHandler(donation) }
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

							<Message.Description>{ donations.data }</Message.Description>

						</Message>
				:
					<div className="flex items-center justify-center w-full h-full">
						<Loading size="100" color='var(--color-primary)' stroke="5" />
					</div>
			}

		</article>
	);
};

export default DonationsTab;