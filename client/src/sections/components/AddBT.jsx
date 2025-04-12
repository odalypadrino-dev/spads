import { useContext, useReducer } from "react";
import { useParams } from 'react-router-dom';
import toast from "react-hot-toast";

import { GlobalState } from "@/GlobalState";

import cn from "@lib/cn";

import useScrollLock from "@hooks/useScrollLock";

import Dialog from "@components/Dialog";
import Fieldset from "@components/Fieldset";
import Form from "@components/Form";

import Tags from "@sections/components/Tags";

import DONOR from "@consts/donor";

import Droplet from "@icons/Droplet";
import Plus from "@icons/Plus";

const INIT_ADD_BT = {
	bloodType: '',
	bloodResults: []
};

const reducer = (current, update) => ({ ...current, ...update });

const AddBT = ({ hasBloodType, action, refresh }) => {
	const { unlockScroll } = useScrollLock(true);
	const params = useParams();
	const state = useContext(GlobalState);
	const { modal: [ ,, closeModal ], loadingModal: [ loading, setLoading ], handlers } = state;
	const [ hdls ] = handlers;
	const btHandlers = hdls.filter(({ key }) => key === 'donationStatus' || key === 'donorInfo');
	const [ btData, setBTData ] = useReducer(reducer, INIT_ADD_BT);

	const onChange = e => {
		const { name, value } = e.target;

		setBTData({ [ name ]: value });
	};

	const cancelHandler = () => {
		if (loading) return;
		unlockScroll();
		closeModal();
	};

	const formValid = Object.entries(btData).every(([ key, value ]) => {
		if (key === 'bloodResults') return value.length;

		if (!hasBloodType && key === 'bloodType') return value;

		return true;
	});

	const all = Object.values(DONOR.BLOOD_TEST_RESULTS.entities)
		.map(({ type, label }) => ({ value: type, label })).find(({ label }) => label === 'Estable');

	const onSubmit = async e => {
		e.preventDefault();

	    if (loading) return;

		if (!formValid) {
			const { bloodType, bloodResults } = btData;

			if (!hasBloodType && !bloodType) return toast.error('El tipo de sangre obligatorio.');
			if (!bloodResults.length) return toast.error('Al menos un resultado es obligatorio.');
		};

        setLoading(true);

		try {
			const { status, success, content } = await action(params.id, btData);

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

				for (let i = 0; i < btHandlers.length; i++) {
					const { action: act } = btHandlers[i];
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
		<Dialog className='max-w-[50vw] gap-7 overflow-visible'>

			<Dialog.Header>
				<Dialog.Header.Title>Añadir Examen de Sangre</Dialog.Header.Title>
			</Dialog.Header>

			<Form onSubmit={ onSubmit } className='justify-between gap-7' data-invalid={ !formValid }>
				
				<Fieldset
					classNames={{
						base: 'px-7',
						content: 'mt-0 gap-5'
					}}
				>

					{
						!hasBloodType ?
							<Fieldset.Field>

								<Fieldset.Field.Container>
									<Fieldset.Field.Container.Dropdown
										{...{
											label: 'Tipo de sangre',
											name: 'bloodType',
											selected: btData.bloodType,
											items: Object.values(DONOR.BLOOD_TYPE.LIST).map(bt => ({ value: bt, label: bt })),
											decorator: <Droplet />,
											onChange: e => onChange({ target: e }),
											'aria-disabled': loading,
											'aria-required': true
										}}
									/>
								</Fieldset.Field.Container>

							</Fieldset.Field>
						:
							null
					}

					<Fieldset.Field className='gap-2'>

						<Fieldset.Field.Label className='font-medium' required>Resultados</Fieldset.Field.Label>

						<Fieldset.Field.Container className='flex flex-col !items-start gap-1'>

								<Tags
									className={cn(
										'flex flex-wrap w-full gap-2 [&_li]:cursor-pointer [&_li.active]:bg-accent-500 [&_li.active]:text-mercury-100 [&_li.active]:border-transparent',
										{ '[&_li:not(.active)]:border-link-water-400 [&_li:not(.active)]:bg-gray-400 [&_li:not(.active)]:opacity-50 [&_li:not(.active)]:cursor-not-allowed': loading || btData.bloodResults.includes(all.value) }
									)}
									selected={ btData.bloodResults }
									all={ all }
									tags={
										Object.values(DONOR.BLOOD_TEST_RESULTS.entities)
											.map(({ type, label }) => ({ value: type, label }))
											.filter(({ value }) => value !== 1)
											.sort((a, b) => a.label !== b.label ? a.label < b.label ? -1 : 1 : 0)
									}
									onClick={ value => {
										if (loading) return toast.error('No puedes seleccionar resultados en este momento');

										if (btData.bloodResults.includes(value)) {
											return setBTData({ bloodResults: [ ...btData.bloodResults.filter(br => br !== value) ] });
										};

										if (btData.bloodResults.includes(all.value)) return toast.error(`"${ all.label }" seleccionado, no puedes seleccionar otros resultados.`);
											
										if (all.value === value) return setBTData({ bloodResults: [ value ] });

										setBTData({ bloodResults: [ ...btData.bloodResults, value ] });
									}}
								/>

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
						icon={ <Plus className='w-4' /> }
						isLoading={ loading }
					>
						Añadir Examen
					</Dialog.Buttons.Accept>

				</Dialog.Buttons>

			</Form>

		</Dialog>
	);
};

export default AddBT;