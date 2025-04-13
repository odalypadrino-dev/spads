import { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Pagination } from "@heroui/react";
import toast from "react-hot-toast";
import { DateTime } from "luxon";

import { GlobalState } from "@/GlobalState";

import cn from "@lib/cn";

import Loading from "@components/Loading";
import Message from "@components/Message";

import BTInfo from "@sections/components/BTInfo";
import AddBT from "@sections/components/AddBT";

import CircleInfo from "@icons/CircleInfo";
import Notebook from "@icons/Notebook";
import Plus from "@icons/Plus";

const btColumns = [
	{
		key: 'date',
		label: 'Fecha'
	},
	{
		key: 'eligibility',
		label: 'Elegibilidad'
	},
	{
		key: 'details',
		label: 'Detalles'
	}
];

const BloodResults = ({ className, data }) => {
	const RESULTS = {
		INVALID: {
			classNames: 'border-red-300 text-red-700 bg-red-100',
			label: 'No Elegible'
		},
		VALID: {
			classNames: 'border-green-300 text-green-700 bg-green-100',
			label: 'Elegible'
		}
	};

	const status = () => {
		if (data.length === 1 && data[0].type === 1) return RESULTS.VALID;

		return RESULTS.INVALID;
	};

	const { classNames, label } = status();

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

const BloodTestsTab = ({ bloodTests, setModal, isAdmin }) => {
	const params = useParams();
	const { addBloodTest, getBloodTest } = bloodTests;
	const state = useContext(GlobalState);
	const { donorAPI, handlers } = state;
	const { donors: { getById } } = donorAPI;
	const [ hdl, newHandler ] = handlers;
	const [ loading, setLoading ] = useState(true);
	const [ bts, setBTs ] = useState(null);
	const [ hasBloodType, setHasBloodType ] = useState(false);
	const [ page, setPage ] = useState(1);

	const fetchBTs = async signal => {
		setLoading(true);

		const { status, success, content } = await getBloodTest(params.id, signal, { page });
		const { status: statusDonor, success: successDonor, content: contentDonor } = await getById(params.id, signal);

		if (status === 500 || statusDonor === 500) {
			toast.error("Error en el servidor.");
			return navigate('/');
		};

		if (!success && !content.data || !successDonor && !contentDonor.data) {
			toast.error(content);
			return navigate('/');
		};

		if (contentDonor.bloodType) setHasBloodType(true);
		setBTs(content);
		setLoading(false);
	};

	useEffect(() => {
		newHandler({
			key: 'bt',
			id: 'fetchBTs',
			action: fetchBTs
		});
	}, []);

	useEffect(() => {
		const fetch = new AbortController();
		if (params) fetchBTs(fetch);

		return () => fetch.abort();
	}, [ page ]);

	
	const addHandler = () => {
		setModal({
			children: <AddBT hasBloodType={ hasBloodType } action={ addBloodTest } refresh={ fetchBTs } />,
			props: { hasCloseBtn: false }
		});
	};
	
	const infoHandler = data => {
		setModal({
			children: <BTInfo data={ data } />
		});
	};

	return (
		<article className="flex flex-col items-start justify-start w-full h-full gap-5">

			<header className="flex items-center justify-between w-full">

				<div>
					<h3 className="text-xl font-semibold">Exámenes de sangre</h3>
					<p className="text-sm text-mercury-700">Análisis que pueden afectar la elegibilidad para donar</p>
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
							Añadir Examen
						</button>
					:
						null
				}

			</header>

			{
				!loading ?
					bts.quantity ?
						<div className="w-full h-full">
							<Table
								isHeaderSticky
								radius="sm"
								aria-label="Exámenes de sangre"
								bottomContent={
									bts.quantity > 6 ?
										<Pagination
											showControls
											showShadow={ false }
											isCompact
											radius='sm'
											total={ Math.ceil(bts.quantity / 6) }
											page={ page }
											onChange={ setPage }
											color='primary'
										/>
									:
										null
								}
							>
								<TableHeader columns={ btColumns }>
									{ col => <TableColumn key={ col.key }>{ col.label }</TableColumn> }
								</TableHeader>

								<TableBody items={ bts.data }>
									{
										bt => {
											const { id, bloodResults, createdAt } = bt;

											return (
												<TableRow key={ `${ id }_${ bloodResults.length }_${ createdAt }` }>

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
														<BloodResults data={ bloodResults } />
													</TableCell>

													<TableCell className="flex items-center justify-center">
														<button
															className="text-bunker-600 hover:brightness-125 transition-[filter] duration-100"
															type="button"
															title="Detalles"
															onClick={ () => infoHandler(bt) }
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

							<Message.Description>{ bts.data }</Message.Description>

						</Message>
				:
					<div className="flex items-center justify-center w-full h-full">
						<Loading size="100" color='var(--color-primary)' stroke="5" />
					</div>
			}

		</article>
	);
};

export default BloodTestsTab;