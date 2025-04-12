import { DateTime } from "luxon";

import Dialog from "@components/Dialog";

const BTInfo = ({ data }) => {
	const {
		bloodResults,
		createdBy,
		createdAt
	} = data;

	const info = [
		{
			key: 'results',
			label: 'Resultados',
			value: <ul className="flex flex-col gap-2">
				{
					bloodResults.map(({ id, type, label }, ind) =>
						<li
							key={ `${ id }-${ ind }-${ type }` }
							className="list-disc list-inside"
						>
							{ label }
						</li>
					)
				}
			</ul>
		},
		{
			key: 'date',
			label: 'Fecha',
			value: DateTime.fromISO(createdAt).setLocale('es-VE').toLocaleString(DateTime.DATE_FULL)
		},
	];

	return (
		<Dialog className='p-7 min-w-[35vw] gap-7'>

			<div>
				<h3 className="text-lg font-semibold">Examen de sangre</h3>
				<p className="text-sm text-mercury-700">Información detallada sobre este examen de sangre</p>
			</div>

			<ul className="flex flex-col gap-7 overflow-y-auto">
				{
					info.map(({ key, label, value }, ind) =>
						<li
							key={ `${ key }_${ ind }` }
							className="flex flex-col items-start justify-start gap-2"
						>
							<span className="text-sm leading-3 text-bunker-700">{ label }</span>
							<div className="leading-4 font-medium select-text">{ value }</div>
						</li>
					)
				}

				<li>
					<div>
						<span className="text-sm leading-3 text-bunker-700">Registrada por:</span>
						<div className="leading-4 font-medium select-text">{ createdBy.name }</div>
						<time
							dateTime={ DateTime.fromISO(createdAt).toISODate() }
							className='text-xs leading-3 text-bunker-800 italic select-text'
						>
							{
								DateTime.fromISO(createdAt).setLocale('es-VE').toLocaleString({
									...DateTime.DATETIME_SHORT,
									day: '2-digit',
									month: '2-digit'
								})
							}
						</time>
					</div>
				</li>
			</ul>

		</Dialog>
	);
};

export default BTInfo;