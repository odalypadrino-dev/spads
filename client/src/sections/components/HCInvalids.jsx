import { useContext } from "react";

import { GlobalState } from "@/GlobalState";

import cn from '@lib/cn';
import getStatus from "@lib/getStatus";

import HCInfo from "@sections/components/HCInfo";

import CalendarDay from "@icons/CalendarDay";
import CircleInfo from "@icons/CircleInfo";
import CircleXMark from "@icons/CircleXMark";
import Clock from "@icons/Clock";
import Viruses from "@icons/Viruses";
	
const status = data => {
	const { level, ended } = data;
	
	if (level === 1) return 'temporary';

	if (level === 2 || level === 3) {
		if (!ended) return 'active';

		return 'temporary';
	};

	if (level === 4) return 'permanent';
};

const HCInvalids = ({ preview = false, list = false, data, isAdmin }) => {
	const state = useContext(GlobalState);
	const { donorAPI, modal: [ , setModal ] } = state;
	const { healthConditions } = donorAPI;
	const { endHealthCondition } = healthConditions;
	
	const STATUS = {
		active: {
			type: 'activa',
			classNames: {
				text700: 'text-orange-700',
				text800: 'text-orange-800',
				bg: 'bg-orange-50',
				border: 'border-orange-200'
			},
			Icon: Clock
		},
		temporary: {
			type: 'temporal',
			classNames: {
				text600: 'text-amber-600',
				text700: 'text-amber-700',
				text800: 'text-amber-800',
				bg: 'bg-amber-50',
				border: 'border-amber-200'
			},
			Icon: CalendarDay
		},
		permanent: {
			type: 'permanente',
			classNames: {
				text700: 'text-red-700',
				text800: 'text-red-800',
				bg: 'bg-red-50',
				border: 'border-red-100'
			},
			Icon: CircleXMark
		}
	};
	const sortedData = data.sort((a, b) => a.label !== b.label ? a.label < b.label ? -1 : 1 : 0);
	const byStatus = Object.groupBy(data, status);
	const hcParsed = Object.entries(byStatus).map(([ key, value ]) => ({
		status: key,
		priority: key === 'permanent' ? 3 : key === 'active' ? 2 : 1,
		data: value
	})).sort((a, b) => b.priority - a.priority);
	
	const infoHandler = data => {
		setModal({
			children: <HCInfo data={ data } action={ endHealthCondition } isAdmin={ isAdmin } />
		});
	};

	return (
		<article
			className={cn(
				"flex flex-col relative w-full",
				{ 'gap-4': !list },
				{ 'p-2 border border-mercury-200 rounded': preview },
				{ 'px-3 border border-lime-200 rounded-md bg-lime-50': list }
			)}
		>

			<header
				className={cn(
					"flex items-center justify-start gap-4",
					{ 'sticky top-0 py-3 bg-lime-50': list }
				)}
			>

				<div className="flex items-center justify-center p-3 aspect-square rounded-full text-lime-500 bg-lime-100">
					<Viruses className='h-5 aspect-square' />
				</div>
				
				<div className="flex flex-col gap-2">
					{
						!preview && !list ?
							<span className="text-lg leading-4 font-medium">No elegible por { sortedData.length > 1 ? 'condiciones' : 'condición' } de salud</span>
						:
							<span className="text-lg leading-4 font-medium">{ sortedData.length > 1 ? 'Restricciones detectadas' : 'Restricción detectada' }</span>
					}

					<span className="text-sm leading-3 text-mercury-600">Se encontraron restricciones con { sortedData.length } { sortedData.length > 1 ? 'condiciones' : 'condición' } de salud</span>
				</div>
			</header>

			{
				!preview ?
					<main className="flex flex-col w-full gap-2">
						{
							hcParsed.map(({ status, data: hcs }, ind) => {
								const { type, classNames: { border, text600, text700, text800, bg }, Icon } = STATUS[ status ];

								return (
									<div
										key={ `${ status }_${ hcs.length }_${ ind }` }
										className={cn(
											"flex flex-col w-full gap-3",
											[ 'p-3 border rounded-md', border, text700, bg ],
											{ 'last:mb-3': list }
										)}
									>

										<span className={cn('font-medium', text800)}>
											{ hcs.length > 1 ? 'Condiciones' : 'Condición' } con restricción { type }
										</span>

										<ul className="flex flex-col gap-3">
											{
												hcs.map(hc => {
													const { id, label } = hc;
													const { status, until } = getStatus(hc);

													return (
														<li key={ id } className="flex items-center gap-3">
															<Icon />
															<div className="flex flex-col">

																<div className="flex items-center gap-2">
																	<span className="font-medium">{ label }</span>
																	<button
																		className="hover:brightness-110 transition-[filter] duration-100"
																		type="button"
																		title="Detalles"
																		onClick={ () => infoHandler(hc) }
																	>
																		<CircleInfo className='w-4' />
																	</button>
																</div>

																{
																	status === 'WAITING' ?
																		<span className={ text600 }>
																			Esperar hasta el: <strong className="font-medium">{ until }</strong>
																		</span>
																	:
																		null
																}

															</div>
														</li>
													);
												})
											}
										</ul>

									</div>
								);
							})
						}
					</main>
				:
					null
			}

		</article>
	);
};

export default HCInvalids;