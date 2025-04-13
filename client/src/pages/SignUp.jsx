import { useState, useReducer } from "react";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

import axios from '@lib/axios';

import SignUpForm from "@sections/SignUpForm";

const INITIAL_DATA = {
	firstName: '',
	lastName: '',
	ci: '',
	password: '',
	confirmPassword: ''
};

const reducer = (current, update) => ({ ...current, ...update });

const SignUp = () => {
    const navigate = useNavigate();
	const [ authData, setAuthData ] = useReducer(reducer, INITIAL_DATA);
	const [ loading, setLoading ] = useState(false);

	const onChange = e => {
		const { name, value } = e.target;

		setAuthData({ [ name ]: value });
	};

	const onSubmit = async e => {
	    if (loading) return e.preventDefault();
		
		e.preventDefault();

        setLoading(true);

		try {
			const { data } = await axios.post('/user/register', { ...authData });
			const { status, success, content } = data;

			if (status === 500) {
				setLoading(false);
				toast.error("Error en el servidor.");
			};
			
			if (!success) {
				setLoading(false);
				toast.error(content);
			};

			if (success) {
				navigate('/login', { replace: true });
				setLoading(false);
				return toast.success("¡Se ha registrado correctamente!");
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
			<SignUpForm
				{ ...authData }
				loading={ loading }
				onChange={ onChange }
				onSubmit={ onSubmit }
			/>
		</main>
	);
};

export default SignUp;