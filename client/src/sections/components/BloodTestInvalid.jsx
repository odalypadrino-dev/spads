import { useContext } from "react";
import { DateTime } from 'luxon';

import { GlobalState } from "@/GlobalState";

import cn from '@lib/cn';

import BTInfo from '@sections/components/BTInfo';

import CircleInfo from "@icons/CircleInfo";
import Microscope from "@icons/Microscope";

const BloodTestInvalid = ({ preview = false, list = false, data }) => {
	const { bloodResults, createdAt } = data;
	const state = useContext(GlobalState);
	const { modal: [ , newModal ] } = state;

	const dateTest = DateTime.fromISO(createdAt).setLocale('es-VE').toLocaleString(DateTime.DATE_FULL);
	
	const infoHandler = data => {
		newModal({
			children: <BTInfo data={ data } />
		});
	};

	return (
		<article
		className={cn(
			"flex flex-col relative w-full",
			{ 'gap-4': !list },
			{ 'p-2 border border-mercury-200 rounded': preview },
			{ 'px-3 border border-red-100 rounded-md bg-red-50': list }
		)}
		>

			<header
				className={cn(
					"flex items-center justify-start gap-4",
					{ 'sticky top-0 py-3 bg-red-50': list }
				)}
			>

				<div className="flex items-center justify-center p-3 aspect-square rounded-full text-red-500 bg-red-100">
					<Microscope className='h-5 aspect-square' />
				</div>
				
				<div className="flex flex-col gap-2">
					{
						!preview && !list ?
							<span className="text-lg leading-4 font-medium">No elegible por análisis de sangre</span>
						:
							<span className="text-lg leading-4 font-medium">Resultados de análisis de sangre</span>
					}

					<span className="text-sm leading-3 text-mercury-600">Valores anormales detectados</span>
				</div>
			</header>

			{
				!preview ?
					<main
						className={cn(
							"flex flex-col w-full text-red-600 gap-3",
							{ 'p-3 border border-red-100 rounded-md bg-red-50': !list },
							{ 'mb-3': list }
						)}
					>

						<div className='flex items-center gap-2'>
							<span className="text-red-800">Análisis del { dateTest }</span>
							<button
								className="hover:brightness-110 transition-[filter] duration-100"
								type="button"
								title="Detalles"
								onClick={ () => infoHandler(data) }
							>
								<CircleInfo className='w-4 text-red-700' />
							</button>
						</div>

						<ul className="flex flex-col gap-3">
							{
								bloodResults.map(({ id, type, label }) =>
									<li
										key={ `${ id }_${ type }` }
										className='list-disc list-inside'
									>
										{ label }
									</li>
								)
							}
						</ul>

					</main>
				:
					null
			}

		</article>
	);
};

export default BloodTestInvalid;