import cn from '@lib/cn';

import CircleXMark from "@icons/CircleXMark";
import Droplet from "@icons/Droplet";

const NoBloodType = ({ preview = false, list = false }) => {
	
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
					<Droplet className='h-5 aspect-square' />
				</div>
				
				<div className="flex flex-col gap-2">
					{
						!preview && !list ?
							<span className="text-lg leading-4 font-medium">No elegible por falta de información</span>
						:
							<span className="text-lg leading-4 font-medium">Grupo sanguíneo desconocido</span>
					}

					<span className="text-sm leading-3 text-mercury-600">Se requieren exámenes de sangre</span>
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
						<span className="text-red-800">Información incompleta</span>
						<ul className="flex flex-col gap-3 [&>li]:flex [&>li]:gap-3">
							<li>
								<CircleXMark />
								<span>Grupo sanguíneo desconocido</span>
							</li>
							<li>
								<CircleXMark />
								<span>No hay exámenes de sangre registrados</span>
							</li>
						</ul>
					</main>
				:
					null
			}

		</article>
	);
};

export default NoBloodType;