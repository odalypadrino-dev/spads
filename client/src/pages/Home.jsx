import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { GlobalState } from '@/GlobalState';

import cn from '@lib/cn';

import USER from '@consts/user';

import ChartColumn from '@icons/ChartColumn';
import HospitalUser from '@icons/HospitalUser';
import List from '@icons/List';
import TableList from '@icons/TableList';

const Home = () => {
	const state = useContext(GlobalState);
	const { userAPI: { user } } = state;
	const [ { user: { role } } ] = user;

	const OPTS = [
		{
			link: 'addDonor',
			Icon: HospitalUser,
			label: 'Añadir un donante',
			roles: [ USER.ROLES.ROOT.value, USER.ROLES.USER.value ]
		},
		{
			link: 'donors',
			Icon: TableList,
			label: 'Listado de donantes',
			roles: [ USER.ROLES.ROOT.value, USER.ROLES.ADMIN.value, USER.ROLES.USER.value ]
		},
		{
			link: 'stats',
			Icon: ChartColumn,
			label: 'Estadísticas',
			roles: [ USER.ROLES.ROOT.value, USER.ROLES.ADMIN.value ]
		},
		{
			link: 'logs',
			Icon: List,
			label: 'Historial de acciones',
			roles: [ USER.ROLES.ROOT.value ]
		}
	];

	return (
		<main className='flex items-start justify-center w-full h-full'>
			<ul className='flex items-center justify-center mt-36 gap-12'>
				{
					OPTS.filter(({ roles }) => roles.includes(role))
						.map(({ link, Icon, label }, ind) =>
							<li key={ `${ link }-${ ind }` }>
								<Link
									to={ `/${ link }` }
									className={cn(
										'group flex flex-col items-center justify-center p-8 rounded-lg shadow-lg gap-2',
										'hover:bg-accent-500 hover:scale-105 transition-transform-colors duration-100 will-change-transform'
									)}
								>
									<Icon className='w-16 text-accent-500 group-hover:text-mercury-50 transition-colors duration-100' />
									<span className='text-xl font-semibold text-mercury-950 group-hover:text-mercury-50 transition-colors duration-100'>{ label }</span>
								</Link>
							</li>
						)
				}
			</ul>
		</main>
	);
};

export default Home;