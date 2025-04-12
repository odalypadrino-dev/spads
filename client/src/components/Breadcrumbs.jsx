import { Fragment, useContext } from 'react';
import { useLocation, Link, matchRoutes } from 'react-router-dom';

import { GlobalState } from "@/GlobalState";

import cn from '@lib/cn';

const Breadcrumbs = ({ routes }) => {
	const state = useContext(GlobalState);
	const { session } = state;
	const [ logged ] = session;
	const location = useLocation();
	const match = matchRoutes(routes, location);
	
	if (!logged) return null;

	const crumbs = routes
		.filter(({ path }) => match?.[0].route.path.includes(path))
		.map(({ path, ...rest }) => ({
			path: Object.keys(match?.[0].params).length ?
					Object.keys(match?.[0].params)
						.reduce((path, param) =>
							path.replace(`:${ param }`, match?.[0].params[ param ]),
							path
						)
				:
					path,
			...rest
		}));

	return (
		<nav className='print:hidden'>
			<ul className={cn(
				'flex items-center justify-start ml-5 mt-3 text-sm gap-2',
				'text-mercury-600'
			)}>

				<li
					className={cn(
						'flex',
						location.pathname === '/' ? 'text-primary font-semibold' : 'has-[a:hover]:text-mercury-900'
					)}
				>
					{
						location.pathname !== '/' ?
							<Link
								to='/'
								className='px-3 py-1 rounded-md hover:bg-blue-100 transition-colors duration-100'
							>
								Inicio
							</Link>
						:
							<span className='px-3 py-1 text-primary font-semibold'>Inicio</span>
					}
				</li>

				{
					crumbs.map(({ path, name }, ind) => {
						const last = ind === crumbs.length - 1;

						return (
							<Fragment key={ `${ path }_${ ind }` }>
								<span>/</span>
								<li className='flex has-[a:hover]:text-mercury-900' >
									{
										!last ?
											<Link
												to={ path }
												className='px-3 py-1 rounded-md hover:bg-blue-100 transition-colors duration-100'
											>
												{ name }
											</Link>
										:
											<span className='px-3 py-1 text-primary font-semibold'>{ name }</span>
									}
								</li>
							</Fragment>
						);
					})
				}

			</ul>
		</nav>
	);
};

export default Breadcrumbs;