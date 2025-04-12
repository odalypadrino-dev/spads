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
import Phone from "@icons/Phone";

const reducer = (current, update) => ({ ...current, ...update });

const PhoneEdit = ({ data, action, refresh }) => {
	const { unlockScroll } = useScrollLock(true);
	const params = useParams();
	const state = useContext(GlobalState);
	const { modal: [ ,, closeModal ], loadingModal: [ loading, setLoading ], handlers } = state;
	const [ hdls ] = handlers;
	const refreshDS = hdls.find(({ key }) => key === 'donationStatus').action;
	const [ phoneData, setPhoneData ] = useReducer(reducer, data);
	const { phone } = phoneData;

	const formValid = Object.entries(phoneData).every(([ _, value ]) => value);

	const onChange = e => {
		const { name, value } = e.target;

		setPhoneData({
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
			const { phone } = phoneData;
			
			if (!phone) return toast.error('El teléfono es requerido.');
		};

        setLoading(true);

		try {
			const { status, success, content } = await action(params.id, phoneData);

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
				<Dialog.Header.Title>Editar Teléfono del Donante</Dialog.Header.Title>
			</Dialog.Header>

			<Form onSubmit={ onSubmit } className='justify-between gap-7' data-invalid={ !formValid }>

				<Fieldset
					classNames={{
						base: 'px-7',
						content: 'mt-0 gap-5'
					}}
				>

					<Fieldset.Field>
						<Fieldset.Field.Container label='Teléfono' htmlFor='phone' hasDecorator>
							<Fieldset.Field.Container.Input
								className={ phone.length ? 'filled' : '' }
								type="text"
								name="phone"
								id="phone"
								value={ phone }
								onChange={ onChange }
								onBeforeInput={ e => {
									const { data } = e;
									if (!(Number(data) >= 0 && Number(data) <= DONOR.PHONE.LENGTH)) return e.preventDefault();
								}}
								autoComplete='off'
								disabled={ loading }
								required
								minLength={ DONOR.PHONE.LENGTH }
								maxLength={ DONOR.PHONE.LENGTH }
							/>

							<Phone />
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
export default PhoneEdit;