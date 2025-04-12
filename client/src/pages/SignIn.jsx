import { useState, useReducer, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

import axios from '@lib/axios';

import { GlobalState } from "@/GlobalState";

import SignInForm from "@sections/SignInForm";

const INITIAL_DATA = {
	ci: '',
	password: '',
	keepSession: false
};

const reducer = (current, update) => ({ ...current, ...update });

const SignIn = () => {
	const state = useContext(GlobalState);
	const { session } = state;
	const [ , setLogged ] = session;
	const navigate = useNavigate();
	const [ authData, setAuthData ] = useReducer(reducer, INITIAL_DATA);
	const [ loading, setLoading ] = useState(false);

	const onChange = e => {
		const { name, value } = e.target;

		setAuthData({
			[ name ]: name === 'keepSession' ? !authData.keepSession : value
		});
	};

	const onSubmit = async e => {
		if (loading) return e.preventDefault();
		
		setLoading(true);
		e.preventDefault();

		try {
			const { data } = await axios.post('/user/login', { ...authData });
			const { success, content } = data;

			if (!success) {
				setLoading(false);
				toast.error(content);
			};

			if (success) {
				localStorage.setItem('accessToken', content);

				navigate('/', { replace: true });
				setLogged(true);
				return toast.success("Sesión iniciada correctamente.");
			};
		} catch (err) {
			const { response: { data } } = err;
			const { success, content } = data;
			
			setLoading(false);
			if (!success) toast.error(content);
		};
	};

	return (
		<main className="flex items-center justify-center">
			<SignInForm
				{ ...authData }
				loading={ loading }
				onChange={ onChange }
				onSubmit={ onSubmit }
			/>
		</main>
	);
};

export default SignIn;