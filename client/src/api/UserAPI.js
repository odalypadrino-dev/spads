import { useReducer, useEffect } from 'react';
import axios from '@lib/axios';

import USER from '@consts/user';

const reducer = (current, update) => ({...current, ...update});

const UserAPI = (setLoading, isLogged) => {
	const [ userState, setUserState ] = useReducer(reducer, {
		user: null,
		isLogged: false,
		isAdmin: false
	});

	const getUser = async () => {
		try {
			const { data } = await axios.get('/user/info');
			const { success, content } = data;

			if (success) {
				setUserState({
					user: content,
					isLogged: true,
					isAdmin: content.role === USER.ROLES.ADMIN.value,
					isRoot: content.role === USER.ROLES.ROOT.value,
				});

				setLoading(false);
			};

			if (!success && content === 'El usuario no existe') {
				await axios.get('/user/logout');
				localStorage.clear();
				window.location.href = '/';
				setLoading(false);
			};
		} catch (err) {
			console.log(err);
		};
	};

	useEffect(() => {
		if (isLogged && !userState.user) getUser();
	}, [ isLogged ]);

	return {
		user: [ userState, setUserState ]
	};
};

export default UserAPI;