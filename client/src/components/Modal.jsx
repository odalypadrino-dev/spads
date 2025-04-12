import { useEffect, useRef, useContext } from 'react';

import { GlobalState } from '@/GlobalState';

import useScrollLock from '@hooks/useScrollLock';

import cn from '@lib/cn';

import Cancel from '@icons/Cancel';

/**
 * @typedef { object } ModalOptions
 * @property { boolean } [ hasCloseBtn = true ]
 * @property { () => void } [ onClose ]
 * @property { React.ReactNode } children
 */

/**
 * @param { ModalOptions } options 
 * @returns 
 */
const Modal = ({
	ind,
	hasCloseBtn = true,
	onClose,
	children
}) => {
	const { lockScroll, unlockScroll } = useScrollLock(true);
	const state = useContext(GlobalState);
	const { modal: [ modal, , closeModal ], loadingModal: [ loading ] } = state;
	const modalRef = useRef(null);
	const childRef = useRef(null);
	
	const handleCloseModal = e => {
		if (loading || childRef.current && childRef.current.contains(e?.target)) return;
		if (onClose) onClose();
		closeModal(ind);
		unlockScroll();
	};

	const handleKeyDown = e => {
		if (loading) return;

		const { key } = e;
		
		if (key === "Escape") {
			handleCloseModal();
			unlockScroll();
		};
	};

	useEffect(() => {
		if (modalRef && modalRef.current) {
			if (modal.length - 1 === ind) modalRef.current.focus();
			lockScroll();
		};
	}, [ modalRef, modal ]);

	return (
		<div
			className='flex items-center justify-center fixed inset-0 outline-none bg-black/30 backdrop-blur z-[9999]'
			onClick={ handleCloseModal }
			onKeyDown={ handleKeyDown }
			tabIndex={ 0 }
			ref={ modalRef }
			role='dialog'
		>
			<div 
				className='relative'
				ref={ childRef }
			>
				{
					hasCloseBtn ?
						<button
							className={cn(
								'flex items-center justify-center absolute top-[.85rem] right-4 p-2 border-none outline-none text-primary bg-transparent transition-colors duration-100 z-[1] [&_svg]:w-4 [&_svg]:stroke-[1.7]',
								loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-red-500'
							)}
							onClick={ () => handleCloseModal() }
							disabled={ loading }
						>
							<Cancel />
						</button>
					:
						null
				}

				{ children }
			</div>
		</div>
	);
};

export default Modal;