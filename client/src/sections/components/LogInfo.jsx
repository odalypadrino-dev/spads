import { DateTime } from "luxon";

import Dialog from "@components/Dialog";

import Type from "@sections/components/Type";

import USER from "@consts/user";

const LogInfo = ({ log }) => {
	const {
		description,
		type,
		createdAt,
		by
	} = log;
	const { ci, role, name } = by;

	const info = [
		{
			key: 'description',
			label: 'Descripción',
			value: description
		},
		{
			key: 'type',
			label: 'Tipo',
			value: <Type type={ type } />
		},
		{
			key: 'date',
			label: 'Fecha',
			value: DateTime.fromISO(createdAt).setLocale('es-VE')
				.toLocaleString({
					...DateTime.DATE_FULL,
					...DateTime.TIME_SIMPLE
				})
		},
		{
			key: 'author',
			label: 'Autor',
			value: <ul className="flex flex-col gap-2">
				<li className='list-disc list-inside'>Nombre: <span className="select-text">{ name }</span></li>
				<li className='list-disc list-inside'>Cédula: <span className="font-mono select-text">{ new Intl.NumberFormat('es-VE').format(Number(ci)) }</span></li>
				<li className='list-disc list-inside'>
					<span className="inline-flex items-center gap-1"><span>Rol:</span> <div className="flex items-center justify-center px-3 border border-mercury-200 rounded-full text-sm font-medium">{ USER.ROLES[ role ].label }</div></span>
				</li>
			</ul>
		},
	];

	return (
		<Dialog className='p-7 min-w-[35vw] gap-7'>

			<div>
				<h3 className="text-lg font-semibold">Acción</h3>
				<p className="text-sm text-mercury-700">Información detallada sobre la acción de este usuario</p>
			</div>

			<ul className="flex flex-col gap-7 overflow-y-auto">
				{
					info.map(({ key, label, value }, ind) =>
						<li
							key={ `${ key }_${ ind }` }
							className="flex flex-col items-start justify-start gap-2"
						>
							<span className="text-sm leading-3 text-bunker-700">{ label }</span>
							<div className="max-w-96 leading-5 font-medium select-text">{ value }</div>
						</li>
					)
				}
			</ul>

		</Dialog>
	);
};

export default LogInfo;