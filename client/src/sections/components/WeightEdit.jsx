import { useContext, useReducer } from "react";
import { useParams } from 'react-router-dom';
import toast from "react-hot-toast";

import { GlobalState } from "@/GlobalState";

import useScrollLock from "@hooks/useScrollLock";

import Dialog from "@components/Dialog";
import Fieldset from "@components/Fieldset";
import Form from "@components/Form";

import DONOR from '@consts/donor';

import FloppyDisk from "@icons/FloppyDisk";
import WeightHanging from "@icons/WeightHanging";

const reducer = (current, update) => ({ ...current, ...update });

const WeightEdit = ({ data, action, refresh }) => {
	const { unlockScroll } = useScrollLock(true);
	const params = useParams();
	const state = useContext(GlobalState);
	const { modal: [ ,, closeModal ], loadingModal: [ loading, setLoading ], handlers } = state;
	const [ hdls ] = handlers;
	const refreshDS = hdls.find(({ key }) => key === 'donationStatus').action;
	const [ weightData, setWeightData ] = useReducer(reducer, data);
	const { weight } = weightData;

	const formValid = Object.entries(weightData).every(([ _, value ]) => value);

	const onChange = e => {
		const { name, value } = e.target;

		setWeightData({
			[ name ]: value,
		});
	};

	const cancelHandler = () => {
		if (loading) return;
		unlockScroll();
		closeModal();
	};

	const onSubmit = async e => {
		e.preventDefault();

	    if (loading) return;

		if (!formValid) {
			const { weight } = weightData;
			
			if (!weight) return toast.error('El peso es requerido.');
		};

        setLoading(true);

		try {
			const { status, success, content } = await action(params.id, weightData);

			if (status === 500) {
				setLoading(false);
				return toast.error("Error en el servidor.");
			};

			if (!success) {
				setLoading(false);
				closeModal();
				return toast.error(content);
			};

			if (success) {
				unlockScroll();
				closeModal();
				setLoading(false);
				refresh();
				refreshDS();
				toast.success(content);
			};

		} catch (err) {
			const { response: { data } } = err;
			const { success, content } = data;
			
			setLoading(false);
			if (!success) return toast.error(content);
		};
	};

	return (
		<Dialog className='gap-7'>

			<Dialog.Header>
				<Dialog.Header.Title>Editar Peso del Donante</Dialog.Header.Title>
			</Dialog.Header>

			<Form onSubmit={ onSubmit } className='justify-between gap-7' data-invalid={ !formValid }>

				<Fieldset
					classNames={{
						base: 'px-7',
						content: 'mt-0 gap-5'
					}}
				>

					<Fieldset.Field>

						<Fieldset.Field.Container label='Peso' htmlFor='weight' hasDecorator>

							<Fieldset.Field.Container.Input
								className={ weight ? 'filled': '' }
								type="number"
								name="weight"
								id="weight"
								value={ weight }
								onChange={ onChange }
								disabled={ loading }
								required
								min={ DONOR.WEIGHT.MIN }
							/>
							
							<WeightHanging />

							<div className='endContent'>Kg</div>

						</Fieldset.Field.Container>

					</Fieldset.Field>

				</Fieldset>

				<Dialog.Buttons>

					<Dialog.Buttons.Cancel
						onClick={ cancelHandler }
						isDisabled={ loading }
					>
						Cancelar
					</Dialog.Buttons.Cancel>

					<Dialog.Buttons.Accept
						type='submit'
						classNames={{
							base: 'text-secondary',
							loading: { color: 'var(--color-secondary)' }
						}}
						icon={ <FloppyDisk className='w-4' /> }
						isLoading={ loading }
					>
						Confirmar
					</Dialog.Buttons.Accept>

				</Dialog.Buttons>

			</Form>

		</Dialog>
	);
};
export default WeightEdit;