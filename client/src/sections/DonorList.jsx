import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Pagination } from "@heroui/react";
import toast from "react-hot-toast";

import Loading from "@components/Loading";
import Message from "@components/Message";

import CircleInfo from "@icons/CircleInfo";
import Notebook from "@icons/Notebook";

const donorColumns = [
	{
		key: 'ci',
		label: 'Cédula'
	},
	{
		key: 'record',
		label: '# Historia'
	},
	{
		key: 'name',
		label: 'Nombre Completo'
	},
	{
		key: 'bloodType',
		label: 'Tipo de Sangre'
	},
	{
		key: 'age',
		label: 'Edad'
	},
	{
		key: 'weight',
		label: 'Peso'
	},
	{
		key: 'genre',
		label: 'Genero'
	},
	{
		key: 'details',
		label: 'Detalles'
	}
];

const DonorList = ({ search, getDonors }) => {
	const navigate = useNavigate();
	const [ donors, setDonors ] = useState(null);
	const [ loading, setLoading ] = useState(true);
	const [ page, setPage ] = useState(1);

	const fetchDonors = async (search, page, signal) => {
		setLoading(true);

		const { status, success, content } = await getDonors(signal, { search, page });

		if (status === 500) {
			toast.error("Error en el servidor.");
			return navigate('/');
		};

		if (!success && !content.data) {
			toast.error(content);
			return navigate('/');
		};

		setDonors(content);
		setLoading(false);
	};

	useEffect(() => {
		const signal = new AbortController();

		fetchDonors(search, page, signal);

		return () => signal.abort();
	}, [ search, page ]);

	const handleClick = id => navigate(`donor/${ id }`);

	return (
		<section className="flex shrink-0 flex-1 flex-col items-start justify-start p-5 w-full border border-mercury-200 rounded-lg gap-5">
			
			<h3 className="text-2xl font-semibold">Lista de Donantes</h3>

			{
				!loading ?
					donors?.quantity ?
						<div className="w-full h-full">
							<Table
								isHeaderSticky
								radius="sm"
								aria-label="Lista de donantes"
								bottomContent={
									donors.quantity > 10 ?
										<Pagination
											showControls
											showShadow={ false }
											isCompact
											radius='sm'
											total={ Math.ceil(donors.quantity / 10) }
											page={ page }
											onChange={ setPage }
											color='primary'
										/>
									:
										null
								}
							>
								<TableHeader columns={ donorColumns }>
									{ col => <TableColumn key={ col.key }>{ col.label }</TableColumn> }
								</TableHeader>

								<TableBody items={ donors.data }>
									{
										donor => {
											const { id, ci, record, fullname, bloodType, age, weight, genre } = donor;
											const { letter, number } = ci;

											return (
												<TableRow key={ `${ letter }${ number }_${ record }` }>

													<TableCell className="font-mono">
														<span className="font-mono">{ letter } - <span className="tracking-wider">{ number }</span></span>
													</TableCell>

													<TableCell>
														<span className="font-mono tracking-wider">{ record }</span>
													</TableCell>

													<TableCell>
														<span className="font-semibold">{ fullname }</span>
													</TableCell>

													<TableCell>
														<span className="flex items-center justify-center px-3 w-fit border border-mercury-200 rounded-full text-sm font-medium">
															{ bloodType || 'Desconocido' }
														</span>
													</TableCell>

													<TableCell><span className="font-mono tracking-wider">{ age }</span> años</TableCell>

													<TableCell><span className="font-mono tracking-wider">{ weight }</span> kg</TableCell>

													<TableCell>{ genre }</TableCell>

													<TableCell className="flex items-center justify-center">
														<button
															className="text-bunker-600 hover:brightness-125 transition-[filter] duration-100"
															type="button"
															title="Detalles"
															onClick={ () => handleClick(id) }
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

							<Message.Description>{ donors.data }</Message.Description>

						</Message>
				:
					<div className="flex items-center justify-center w-full h-full">
						<Loading size="100" color='var(--color-primary)' stroke="5" />
					</div>
			}
		</section>
	);
};

export default DonorList;