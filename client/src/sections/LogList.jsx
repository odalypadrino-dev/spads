import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Pagination } from "@heroui/react";
import toast from "react-hot-toast";
import { DateTime } from "luxon";

import Loading from "@components/Loading";
import Message from "@components/Message";

import LogInfo from "@sections/components/LogInfo";
import Type from "@sections/components/Type";

import CircleInfo from "@icons/CircleInfo";
import Notebook from "@icons/Notebook";

const logColumns = [
	{
		key: 'type',
		label: 'Tipo'
	},
	{
		key: 'description',
		label: 'Descripción de la Acción'
	},
	{
		key: 'date',
		label: 'Fecha'
	},
	{
		key: 'details',
		label: 'Detalles'
	}
];

const LogList = ({ search, getLogs, newModal }) => {
	const navigate = useNavigate();
	const [ logs, setLogs ] = useState(null);
	const [ loading, setLoading ] = useState(true);
	const [ page, setPage ] = useState(1);

	const fetchLogs = async (search, page, signal) => {
		const { status, success, content } = await getLogs(signal, { search, page, limit: 7 });

		if (status === 500) {
			toast.error("Error en el servidor.");
			return navigate('/');
		};

		if (!success && !content.data) {
			toast.error(content);
			return navigate('/');
		};

		setLogs(content);
		setLoading(false);
	};

	useEffect(() => {
		const signal = new AbortController();

		fetchLogs(search, page, signal);

		return () => signal.abort();
	}, [ search, page ]);

	const handleClick = log => {
		newModal({ children: <LogInfo log={ log } /> });
	};

	return (
		<section className="flex shrink-0 flex-1 flex-col items-start justify-start p-5 w-full border border-mercury-200 rounded-lg gap-5">
			
			<h3 className="text-2xl font-semibold">Historial de acciones</h3>

			{
				!loading ?
					logs?.quantity ?
						<div className="w-full h-full">
							<Table
								isHeaderSticky
								radius="sm"
								aria-label="Historial de acciones"
								bottomContent={
									logs.quantity > 7 ?
										<Pagination
											showControls
											showShadow={ false }
											isCompact
											radius='sm'
											total={ Math.ceil(logs.quantity / 7) }
											page={ page }
											onChange={ setPage }
											color='primary'
										/>
									:
										null
								}
							>
								<TableHeader columns={ logColumns }>
									{ col => <TableColumn key={ col.key }>{ col.label }</TableColumn> }
								</TableHeader>

								<TableBody items={ logs.data }>
									{
										log => {
											const { id, type, description, createdAt } = log;

											return (
												<TableRow key={ `${ id }${ type }_${ createdAt }` }>

													<TableCell>
														<Type type={ type } />
													</TableCell>

													<TableCell>{ description }</TableCell>

													<TableCell>
														<span className="font-mono font-medium">
															{
																DateTime.fromISO(createdAt).setLocale('es-VE')
																	.toLocaleString({
																		...DateTime.DATE_SHORT,
																		day: '2-digit',
																		month: '2-digit',
																		...DateTime.TIME_SIMPLE
																	})
															}
														</span>
													</TableCell>

													<TableCell className="flex items-center justify-center">
														<button
															className="text-bunker-600 hover:brightness-125 transition-[filter] duration-100"
															type="button"
															title="Detalles"
															onClick={ () => handleClick(log) }
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

							<Message.Description>{ logs.data }</Message.Description>

						</Message>
				:
					<div className="flex items-center justify-center w-full h-full">
						<Loading size="100" color='var(--color-primary)' stroke="5" />
					</div>
			}
		</section>
	);
};

export default LogList;