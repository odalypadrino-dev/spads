import cn from '@lib/cn';

import CalendarDay from "@icons/CalendarDay";
import CircleExclamation from "@icons/CircleExclamation";
import Clock from "@icons/Clock";

const AgeInvalid = ({ preview = false, list = false, data }) => {
	const { age, ageRange: [ MIN, MAX ] } = data;
	const overBy = `${ age - MAX } ${ age - MAX === 1 ? "año" : "años" }`;

	return (
		<article
		className={cn(
			"flex flex-col relative w-full",
			{ 'gap-4': !list },
			{ 'p-2 border border-mercury-200 rounded': preview },
			{ 'px-3 border border-amber-200 rounded-md bg-amber-50': list }
		)}
		>

			<header
				className={cn(
					"flex items-center justify-start gap-4",
					{ 'sticky top-0 py-3 bg-amber-50': list }
				)}
			>

				<div className="flex items-center justify-center p-3 aspect-square rounded-full text-amber-500 bg-amber-100">
					<Clock className='h-5 aspect-square' />
				</div>
				
				<div className="flex flex-col gap-2">
					{
						!preview && !list ?
							<span className="text-lg leading-4 font-medium">No elegible por edad</span>
						:
							<span className="text-lg leading-4 font-medium">
								{
									age < MIN ?
										'Menor de edad'
									:
										'Límite de edad superado'
								}
							</span>
					}

					<span className="text-sm leading-3 text-mercury-600">
						{
							age < MIN ?
								'Edad mínima no alcanzada'
							:
								'Edad máxima superada'
						}
					</span>
				</div>
			</header>

			{
				!preview ?
					<main
						className={cn(
							"flex flex-col w-full text-amber-700 gap-3",
							{ 'p-3 border border-amber-200 rounded-md bg-amber-50': !list },
							{ 'mb-3': list }
						)}
					>
						<span className="text-amber-800">
							{
								age < MIN ?
									'Requisito de edad no cumplido'
								:
									'Límite de edad superado'
							}
						</span>
						<ul className="flex flex-col gap-3 [&>li]:flex [&>li]:gap-3">
							<li>
								<Clock />
								<span>Edad actual: <strong className="text-amber-700">{ age } años</strong></span>
							</li>
							<li>
								<CircleExclamation />
								<span>Edad { age < MIN ? 'mínima requerida' : 'máxima permitida' }: <strong className="text-amber-700">{ age < MIN ? MIN : MAX } años</strong></span>
							</li>
							{
								age > MAX ?
									<li>
										<CalendarDay />
										<span>Ha superado el límite por: <strong className="text-amber-700">{ overBy }</strong></span>
									</li>
								:
									null
							}
						</ul>
					</main>
				:
					null
			}

		</article>
	);
};

export default AgeInvalid;