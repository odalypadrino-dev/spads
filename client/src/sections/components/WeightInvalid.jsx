import cn from '@lib/cn';

import CircleExclamation from "@icons/CircleExclamation";
import CircleXMark from "@icons/CircleXMark";
import WeightHanging from "@icons/WeightHanging";

const WeightInvalid = ({ preview = false, list = false, data }) => {
	const { weight, minWeight } = data;
	const remainingWeight = minWeight - weight;

	return (
		<article
			className={cn(
				"flex flex-col relative w-full",
				{ 'gap-4': !list },
				{ 'p-2 border border-mercury-200 rounded': preview },
				{ 'px-3 border border-blue-200 rounded-md bg-blue-50': list }
			)}
		>

			<header
				className={cn(
					"flex items-center justify-start gap-4",
					{ 'sticky top-0 py-3 bg-blue-50': list }
				)}
			>

				<div className="flex items-center justify-center p-3 aspect-square rounded-full text-blue-500 bg-blue-100">
					<WeightHanging className='h-5 aspect-square' />
				</div>
				
				<div className="flex flex-col gap-2">
					{
						!preview && !list ?
							<span className="text-lg leading-4 font-medium">No elegible por peso</span>
						:
							<span className="text-lg leading-4 font-medium">Bajo de peso</span>
					}

					<span className="text-sm leading-3 text-mercury-600">Peso mínimo no alcanzado</span>

				</div>
			</header>

			{
				!preview ?
					<main
						className={cn(
							"flex flex-col w-full text-blue-700 gap-3",
							{ 'p-3 border border-blue-200 rounded-md bg-blue-50': !list },
							{ 'mb-3': list } 
						)}
					>
						<span className="text-blue-800">Requisito de peso no cumplido</span>
						<ul className="flex flex-col gap-3 [&>li]:flex [&>li]:gap-3">
							<li>
								<WeightHanging />
								<span>Peso actual: <strong className="text-blue-700">{ weight } kg</strong></span>
							</li>
							<li>
								<CircleExclamation />
								<span>Peso mínimo requerido: <strong className="text-blue-700">{ minWeight } kg</strong></span>
							</li>
							<li>
								<CircleXMark />
								<span>Faltan <strong className="text-blue-700">{ remainingWeight } kg</strong> para alcanzar el peso mínimo</span>
							</li>
						</ul>
					</main>
				:
					null
			}

		</article>
	);
};

export default WeightInvalid;