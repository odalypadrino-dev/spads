import { useState, useReducer, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { GlobalState } from '@/GlobalState';

import AddDonorForm from '@sections/AddDonorForm';

import DONOR from '@consts/donor';

const INITIAL_DATA = {
	names: '',
	surnames: '',
	letter: DONOR.CI.TYPES[0],
	number: '',
	birthdate: '',
	genre: '',
	phone: '',
	dir: '',
	weight: ''
};

const reducer = (current, update) => ({...current, ...update});

const AddDonor = () => {
	const navigate = useNavigate();
	const state = useContext(GlobalState);
	const { donorAPI: { donors } } = state;
	const { addDonor } = donors;
	const [ loading, setLoading ] = useState(false);
	const [ donorData, setDonorData ] = useReducer(reducer, INITIAL_DATA);

	const onChange = e => {
		const { name, value } = e.target;

		setDonorData({
			[ name ]: value
		});
	};

	const formValid = Object.entries(donorData).every(([ _, value ]) => value);

	const onSubmit = async e => {
		e.preventDefault();

	    if (loading) return;

		if (!formValid) {
			const { names, surnames, letter, number, birthdate, genre, phone, dir, weight } = donorData;

			if (!names) return toast.error('Los nombres son obligatorios.');
			if (!surnames) return toast.error('Los apellidos son obligatorios.');
			if (!letter || !number) return toast.error('La cédula es obligatoria.');
			if (!birthdate) return toast.error('La fecha de nacimiento es obligatoria.');
			if (!genre) return toast.error('El género es obligatorio.');
			if (!phone) return toast.error('El teléfono es obligatorio.');
			if (!dir) return toast.error('La dirección es obligatoria.');
			if (!weight) return toast.error('El peso es obligatorio.');
		};

        setLoading(true);

		try {
			const data = await addDonor(donorData);

			const { status, success, content } = data;

			if (status === 500) {
				toast.error("Error en el servidor.");
				return setLoading(false);
			};
	
			if (!success) {
				toast.error(content);
				return setLoading(false);
			};
			
			navigate(`/donors/donor/${ content.data }`);
			setLoading(false);
			return toast.success(content.message);
		} catch (err) {
			const { response: { data } } = err;
			const { success, content } = data;
			
			setLoading(false);
			if (!success) toast.error(content);
		};
	};

	return (
		<main className='flex items-center justify-center mt-6'>
			<AddDonorForm 
				{...{
					donorData,
					onChange,
					onSubmit,
					loading,
					formValid
				}} 
			/>
		</main>
	);
};

export default AddDonor;