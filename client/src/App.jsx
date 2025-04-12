import { useEffect, useContext } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { DataProvider, GlobalState } from '@/GlobalState';

import Home from '@pages/Home';
import SignIn from '@pages/SignIn';
import SignUp from '@pages/SignUp';
import AddDonor from '@pages/AddDonor';
import Donors from '@pages/Donors';
import DonorDetail from '@pages/DonorDetail';
import Stats from '@pages/Stats';
import Logs from '@pages/Logs';

import Breadcrumbs from '@components/Breadcrumbs';
import Header from '@components/Header';
import Modal from '@components/Modal';
import Protected from '@components/Protected';

import USER from '@consts/user';

const ScrollToTop = ({ children }) => {
	const location = useLocation();
	
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "instant"
		});
	}, [ location ]);

	return children;
};

const CustomOutlet = () => {
	const state = useContext(GlobalState);
	const { modal: [ modal ] } = state;

	return (
		<>

			<Outlet />

			{
				modal.length ?
					modal.map((m, ind) =>
						<Modal
							key={ `modal_${ ind }` }
							ind={ ind }
							{ ...m.props }
						>
							{ m.children }
						</Modal>
					)
				:
					null
			}

		</>
	);
};

const routes = [
	{
		path: '/addDonor',
		name: 'Añadir un donante'
	},
	{
		path: '/donors',
		name: 'Listado de donantes'
	},
	{
		path: '/donors/donor/:id',
		name: 'Donante'
	},
	{
		path: '/stats',
		name: 'Estadísticas'
	},
	{
		path: '/logs',
		name: 'Historial de acciones'
	}
];

const AppLayout = () => {
	const location = useLocation();
	const { pathname } = location;

	return (
		<DataProvider>
			<ScrollToTop>

				<Header />

				<Breadcrumbs routes={ routes } />
	
				<CustomOutlet key={ pathname } />
	
				<Toaster position='bottom-right' />

			</ScrollToTop>
		</DataProvider>
	);
};

const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{
				path: '/',
				element: <Protected to="/login" auth={ true }> <Home /> </Protected>
			},
			{
				path: '/login',
				element: <Protected to="/" auth={ false }> <SignIn /> </Protected>
			},
			{
				path: '/register',
				element: <Protected to="/" auth={ false }> <SignUp /> </Protected>
			},
			{
				path: '/addDonor',
				element: <Protected to="/login" auth={ true }> <AddDonor /> </Protected>
			},
			{
				path: '/donors',
				element: <Protected to="/login" auth={ true }> <Donors /> </Protected>
			},
			{
				path: '/donors/donor/:id',
				element: <Protected to="/login" auth={ true }> <DonorDetail /> </Protected>
			},
			{
				path: '/stats',
				element: <Protected to="/login" auth={ true }> <Stats /> </Protected>
			},
			{
				path: '/logs',
				element: <Protected to="/login" auth={ true }> <Logs /> </Protected>
			}
		]
	}
]);

function App() {
	return <RouterProvider router={ router } />;
};

export default App;