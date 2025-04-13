import { createContext, useState, useEffect } from 'react';

import UserAPI from '@api/UserAPI';
import DonorAPI from '@api/DonorAPI';
import AdminAPI from '@api/AdminAPI';
import RootAPI from '@api/RootAPI';

// eslint-disable-next-line react-refresh/only-export-components
export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
	const [ modal, setModal ] = useState([]);
	const [ loadingModal, setLoadingModal ] = useState(false);
	const [ logged, setLogged ] = useState(false);
	const [ loading, setLoading ] = useState(true);
	const [ handlers, setHandlers ] = useState([]);

	const newModal = modalData => setModal(modal => [ ...modal, modalData ]);
	const closeModal = () => {
		if (modal.length) setModal(modal => modal.filter((_, index) => index !== modal.length - 1));
	};

	const newHandler = handler => {
		setHandlers(handlers => [
			...handlers.filter(({ id }) => id !== handler.id),
			handler
		]);
	};

	useEffect(() => {
		const tryLogin = () => {
			const accessToken = localStorage.getItem('accessToken');
			if (accessToken) return setLogged(true);
			setLoading(false);
		};

		if (!logged) tryLogin();
	}, [ logged ]);

	const state = {
		userAPI: UserAPI(setLoading, logged),
		donorAPI: DonorAPI(),
		adminAPI: AdminAPI(),
		rootAPI: RootAPI(),
		session: [ logged, setLogged ],
		loading: [ loading, setLoading ],
		loadingModal: [ loadingModal, setLoadingModal ],
		modal: [ modal, newModal, closeModal ],
		handlers: [ handlers, newHandler ]
	};

	return (
		<GlobalState.Provider value={ state }>
			{ children }
		</GlobalState.Provider>
	);
};