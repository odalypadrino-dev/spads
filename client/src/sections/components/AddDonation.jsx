import { useContext, useReducer } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import toast from "react-hot-toast";

import { GlobalState } from "@/GlobalState";

import useScrollLock from "@hooks/useScrollLock";

import Dialog from "@components/Dialog";
import Fieldset from "@components/Fieldset";
import Form from "@components/Form";

import DONOR from '@consts/donor';

import Clock from "@icons/Clock";
import UserQuestion1 from "@icons/UserQuestion1";
import UserQuestion2 from "@icons/UserQuestion2";

const INIT_DONATION = {
	patientFirstName: '',
    patientLastName: '',
    patientLetter: DONOR.CI.TYPES[0],
	patientNumber: ''
};

const reducer = (current, update) => ({ ...current, ...update });

const AddDonation = ({ action, refresh }) => {
	const { unlockScroll } = useScrollLock(true);
	const state = useContext(GlobalState);
	const { modal: [ ,, closeModal ], loadingModal: [ loading, setLoading ], handlers } = state;
	const [ hdls ] = handlers;
	const donationHandlers = hdls.filter(({ key }) => key === 'donation');
	const [ donationData, setDonationData ] = useReducer(reducer, INIT_DONATION);

	const formValid = Object.entries(donationData).every(([ _, value ]) => value);

	const onChange = e => {
		const { name, value } = e.target;

		setDonationData({ [ name ]: value });
	};

	const setValue = (name, value) => onChange({ target: { name, value } });

	const cancelHandler = () => {
		if (loading) return;
		unlockScroll();
		closeModal();
	};

	const onSubmit = async e => {
		e.preventDefault();

	    if (loading) return;

		if (!formValid) {
			const { patientFirstName, patientLastName, patientLetter, patientNumber } = donationData;
			
			if (!patientFirstName) return toast.error('El nombre del paciente es requerido.');
			if (!patientLastName) return toast.error('El apellido del paciente es requerido.');
			if (!patientLetter) return toast.error('El tipo de cédula del paciente es requerido.');
			if (!patientNumber) return toast.error('El número de cédula del paciente es requerido.');
		};

        setLoading(true);

		try {
			const { status, success, content } = await action(donationData);

			if (status === 500) {
				setLoading(false);
				return toast.error(content);
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

				for (let i = 0; i < donationHandlers.length; i++) {
					const { action: act } = donationHandlers[i];
					act();
				};

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
				<Dialog.Header.Title>Programar Donación</Dialog.Header.Title>
				<Dialog.Header.Description>Programar donación de sangre para un paciente</Dialog.Header.Description>
			</Dialog.Header>

			<Form onSubmit={ onSubmit } className='justify-between gap-7' data-invalid={ !formValid }>

				<Fieldset
					title='Datos del paciente'
					classNames={{
						base: 'items-start px-7',
						label: 'text-xl font-bold mb-4',
						content: 'mt-0 gap-5'
					}}
				>

					<Fieldset.Field>

						<Fieldset.Field.Container label='Nombre' htmlFor='patientFirstName' hasDecorator>

							<Fieldset.Field.Container.Input
								className={ donationData.patientFirstName.length ? 'filled' : '' }
								type="text"
								name="patientFirstName"
								id="patientFirstName"
								value={ donationData.patientFirstName }
								onChange={ onChange }
								autoComplete='off'
								disabled={ loading }
								required
								minLength={ DONOR.NAMES.MIN_LENGTH }
							/>
							
							<UserQuestion2 />
							
						</Fieldset.Field.Container>

					</Fieldset.Field>

					<Fieldset.Field>

						<Fieldset.Field.Container label='Apellido' htmlFor='patientLastName' hasDecorator>

							<Fieldset.Field.Container.Input
								className={ donationData.patientLastName.length ? 'filled' : '' }
								type="text"
								name="patientLastName"
								id="patientLastName"
								value={ donationData.patientLastName }
								onChange={ onChange }
								autoComplete='off'
								disabled={ loading }
								required
								minLength={ DONOR.SURNAMES.MIN_LENGTH }
							/>
							
							<UserQuestion1 />
							
						</Fieldset.Field.Container>

					</Fieldset.Field>
	
					<Fieldset.Field>

						<Fieldset.Field.Container label='Cédula' htmlFor='patientNumber' hasDecorator>

							<Fieldset.Field.Container.Input
								className={ donationData.patientNumber.length ? 'filled' : '' }
								type="text"
								inputMode="numeric"
								name="patientNumber"
								id="patientNumber"
								value={ donationData.patientNumber }
								onChange={ onChange }
								autoComplete='off'
								onBeforeInput={ e => {
									const { data } = e;
									if (!(Number(data) >= 0 && Number(data) <= DONOR.CI.MAX_LENGTH)) return e.preventDefault();
								}}
								disabled={ loading }
								required
								minLength={ DONOR.CI.MIN_LENGTH }
								maxLength={ DONOR.CI.MAX_LENGTH }
							/>

							<Dropdown
								classNames={{
									base: 'max-w-fit',
									content: 'min-w-fit bg-white'
								}}
							>

								<DropdownTrigger className='absolute left-[12px]'>
									<Button
										radius='sm'
										variant="light" 
										className='data-[focus-visible=true]:!outline-none min-w-fit aspect-square text-[18px] font-bold text-mercury-900 uppercase'
									>
										{ donationData.patientLetter }
									</Button>
								</DropdownTrigger>
								
								<DropdownMenu
									aria-label="Seleccionar el tipo de la cédula"
									variant="flat"
									disallowEmptySelection
									selectionMode="single"
									selectedKeys={ donationData.patientLetter }
									onSelectionChange={ e => setValue('patientLetter', [...e][0]) }
									classNames={{
										base: 'max-w-fit',
										list: 'max-w-fit'
									}}
									itemClasses={{
										base: [
											"data-[selectable=true]:focus:bg-mercury-100",
											'!outline-none',
											''
										],
										title: "font-medium"
									}}
								>
									{
										DONOR.CI.TYPES.map(letter =>
											<DropdownItem 
												key={ letter }
												classNames={{
													base: 'max-w-fit',
													title: [
														'font-bold'
													]
												}}
											>
												{ letter }
											</DropdownItem>
										)
									}
								</DropdownMenu>

							</Dropdown>
							
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
						icon={ <Clock className='w-4' /> }
						isLoading={ loading }
					>
						Programar
					</Dialog.Buttons.Accept>

				</Dialog.Buttons>

			</Form>

		</Dialog>
	);
};

export default AddDonation;