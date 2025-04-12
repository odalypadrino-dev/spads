import Fieldset from "@components/Fieldset";
import Loading from "@components/Loading";

import Print from "@icons/Print";

const TIME = {
	month: {
		title: 'del Mes',
		description: 'Mes:'
	},
	week: {
		title: 'de la Semana',
		description: 'Semana:'
	},
	day: {
		title: 'del Día',
		description: 'Día:'
	}
};

const Title = ({ time }) => {
	const { unit, value } = time;

	return (
		<div>
			<h3 className="text-2xl font-bold">Estadísticas { TIME[ unit ].title }</h3>
			<p className="text-mercury-700">{ TIME[ unit ].description } <span className="capitalize font-medium">{ value }</span></p>
		</div>
	);
};

const UNITS = [
	{
		value: 'month',
		label: 'Mensual'
	},
	{
		value: 'week',
		label: 'Semanal'
	},
	{
		value: 'day',
		label: 'Diario'
	}
];

const StatsHeader = ({ time, timeState, loading }) => {
	const [ selected, setTime ] = timeState;

	return (
		<section className="flex item justify-between w-full">
			
			{
				loading ?
					<Loading color='var(--color-primary)' size='35' stroke='3' />
				:
					<Title time={ time }/>
			}

			<div className="flex gap-4 print:hidden">
				<Fieldset.Field.Container.Dropdown
					label='Período'
					selected={ UNITS.find(u => u.value === selected)?.label }
					items={ UNITS }
					onChange={ e => setTime(e.value) }
					classNames={{
						base: 'w-40 border-mercury-200 bg-transparent'
					}}
				/>
	
				<div
					className="flex items-center justify-center h-full aspect-square border border-mercury-200 rounded-xl cursor-pointer"
					title="Imprimir"
					onClick={ () => window.print() }
				>
					<Print />
				</div>
			</div>

		</section>
	);
};

export default StatsHeader;