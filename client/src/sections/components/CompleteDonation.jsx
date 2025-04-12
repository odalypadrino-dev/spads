import { useContext } from "react";
import { useParams } from 'react-router-dom';
import toast from "react-hot-toast";

import { GlobalState } from "@/GlobalState";

import Dialog from "@components/Dialog";

import CircleCheck from "@icons/CircleCheck";

const CompleteDonation = ({ data, action, setDonation }) => {
	const params = useParams();
	const state = useContext(GlobalState);
	const { modal: [ ,, closeModal ], loadingModal: [ loading, setLoading ], handlers } = state;
	const [ hdls ] = handlers;
	const donationHandlers = hdls.filter(({ key }) => key === 'donation' || key === 'donationStatus');

	console.log(donationHandlers);

	const cancelHandler = () => {
		if (loading) return;
		closeModal();
	};

	const onSubmit = async e => {
		e.preventDefault();

	    if (loading) return;

        setLoading(true);

		try {
			const { status, success, content } = await action(params.id, data.id);

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
				setLoading(false);
				setDonation(content.data);
				closeModal();

				for (let i = 0; i < donationHandlers.length; i++) {
					const { action: act } = donationHandlers[i];
					act();
				};

				toast.success(content.message);
			};

		} catch (err) {
			const { response: { data } } = err;
			const { success, content } = data;
			
			setLoading(false);
			if (!success) return toast.error(content);
		};
	};

	return (
		<Dialog>

			<Dialog.Header>
				<Dialog.Header.Title>¿Completar donación?</Dialog.Header.Title>
			</Dialog.Header>

			<Dialog.Header.Description className='m-4'>Esta acción marcará la donación como completada</Dialog.Header.Description>

			<Dialog.Buttons>

				<Dialog.Buttons.Cancel
					onClick={ cancelHandler }
					isDisabled={ loading }
				>
					Cancelar
				</Dialog.Buttons.Cancel>

				<Dialog.Buttons.Accept
					classNames={{
						base: 'text-secondary',
						loading: { color: 'var(--color-secondary)' }
					}}
					onClick={ onSubmit }
					icon={ <CircleCheck className='w-4' /> }
					isLoading={ loading }
				>
					Completar
				</Dialog.Buttons.Accept>

			</Dialog.Buttons>

		</Dialog>
	);
};

export default CompleteDonation;