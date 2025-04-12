import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import toast from "react-hot-toast";

import cn from '@lib/cn';
import formatPhone from "@lib/formatPhone";

import Loading from "@components/Loading";
import MissingPhoto from "@components/MissingPhoto";

import WeightEdit from "@sections/components/WeightEdit";
import PhoneEdit from "@sections/components/PhoneEdit";
import DirEdit from "@sections/components/DirEdit";

import DONOR from '@consts/donor';

import Droplet from '@icons/Droplet';
import Edit from "@icons/Edit";
import Person from '@icons/Person';
import Print from '@icons/Print';
import VenusMars from '@icons/VenusMars';
import WeightHanging from '@icons/WeightHanging';

const PROFILE_VARIANTS = {
    [ DONOR.GENRE[0] ]: {
        PHOTO: 'text-accent-300 bg-accent-200'
    },
    [ DONOR.GENRE[1] ]: {
        PHOTO: 'text-pink-300 bg-pink-200'
    }
};

const DonorInfo = ({ donors, newModal, handlers, isAdmin }) => {
	const navigate = useNavigate();
	const params = useParams();
	const [ hdl, newHandler ] = handlers;
	const { getById, updateDonor } = donors;
	const [ donor, setDonor ] = useState(null);
	const [ loading, setLoading ] = useState(true);

	const fetchDonor = async () => {
		setLoading(true);

		const { status, success, content } = await getById(params.id);

		if (status === 500) {
			toast.error("Error en el servidor.");
			return navigate('/');
		};

		if (!success) {
			toast.error(content);
			return navigate('/');
		};

		setDonor(content);
		setLoading(false);
	};

	useEffect(() => {
		if (!donor && params) fetchDonor();
		
		if (hdl.every(({ id }) => id !== 'fetchDonor')) newHandler({
			key: 'donorInfo',
			id: 'fetchDonor',
			action: fetchDonor
		});
	}, []);

	if (loading) return (
		<section className="flex flex-col items-center justify-center p-5 w-[25.5rem] h-full border border-mercury-200 rounded-lg">
			<Loading size="100" color='var(--color-primary)' stroke="5" />
		</section>
	);

	const {
		record: recordNumber,
		name,
		fullname,
		ci: { letter, number },
		age,
		genre,
		phone,
		dir,
		weight,
		bloodType,
		registeredBy,
		lastUpdatedBy,
		createdAt,
		updatedAt
	} = donor;

	const editWeight = () => {
		newModal({
			children: <WeightEdit data={{ weight }} action={ updateDonor } refresh={ fetchDonor } />,
			props: { hasCloseBtn: false }
		});
	};

	const editPhone = () => {
		newModal({
			children: <PhoneEdit data={{ phone }} action={ updateDonor } refresh={ fetchDonor } />,
			props: { hasCloseBtn: false }
		});
	};

	const editDir = () => {
		newModal({
			children: <DirEdit data={{ dir }} action={ updateDonor } refresh={ fetchDonor } />,
			props: { hasCloseBtn: false }
		});
	};

    const health = [
        {
            data: [
                {
                    Icon: Person,
                    label: 'Edad',
                    value: `${ age } años`
                },
                {
                    Icon: VenusMars,
                    label: 'Género',
                    value: genre
                }
            ]
        },
        {
            data: [
                {
                    Icon: WeightHanging,
                    label: 'Peso',
                    value: <span className="font-mono select-text">{ `${ weight } Kg` }</span>
                },
                {
                    Icon: Droplet,
                    label: 'Tipo de Sangre',
                    value: bloodType ?? DONOR.BLOOD_TYPE.UNKNOWN
                }
            ]
        }
    ];

	const info = [
        {
			label: 'Teléfono',
			value: <span className="font-mono select-text">{ formatPhone(phone) }</span>,
			editHandler: editPhone
        },
        {
			label: 'Dirección',
			value: dir,
			editHandler: editDir
        }
	];

	const record = [
		{
			label: 'Registrado por:',
			value: registeredBy.name,
			timestamp: createdAt
		},
		{
			label: 'Actualizado por:',
			value: lastUpdatedBy.name,
			timestamp: updatedAt
		}
	];

	return (
		<section className="flex flex-col items-start justify-between p-5 w-[25.5rem] print:w-full h-full print:h-fit border border-mercury-200 rounded-lg print:gap-2">

			<div className="flex justify-between w-full">
				<div>
					<h3 className="text-xl font-semibold">Información del Donante</h3>
					<p className="text-sm text-mercury-700">Datos médicos y personales</p>
				</div>
				
				<div
					className="flex print:hidden items-center justify-center h-full aspect-square border border-mercury-200 rounded-xl cursor-pointer"
					title="Imprimir"
					onClick={ () => window.print() }
				>
					<Print />
				</div>
			</div>

			<div className="flex items-center justify-between gap-3">
				<MissingPhoto className={cn( 'w-16 rounded-full', PROFILE_VARIANTS[genre].PHOTO )} />
				<div className="flex flex-col justify-start gap-[.35rem]">
					<span className="text-lg leading-4 font-medium">{ name }</span>
					<span className="leading-4 text-bunker-500 font-mono"><span className="font-bold">{ letter }</span> - <span className="select-text">{ new Intl.NumberFormat('es-VE').format(Number(number)) }</span></span>
					<div className="flex font-mono text-sm font-medium leading-3 tracking-wider text-mercury-500 gap-1 select-text">{ recordNumber }</div>
				</div>
			</div>

			<ul className="flex flex-col print:flex-row items-center justify-start w-full divide-y print:divide-y-0 print:divide-x">
				{
				    health.map(({ data }, idx) =>
				        <li key={ `row_${ idx }` } className='flex items-center justify-start w-full divide-x'>
				
	        				{
	        				    data.map(({ Icon, label, value }, ind) =>
	        				        <div key={ `column_${ ind }` } className={cn(
										'group flex items-center justify-start py-3 pl-4 min-w-44 gap-3',
										{ 'pb-0': idx === health.length - 1 }
									)}>
	        				
										<div className='flex items-center justify-center p-2 border-2 border-bunker-100 rounded-full [&>svg]:h-5 [&>svg]:text-bunker-500 [&>svg]:aspect-square'>
											<Icon />
										</div> 
	                				    
	                				    <div className='flex flex-col items-start justify-center gap-1'>
	                				        <span className='text-sm leading-3 text-bunker-700'>{ label }</span>
	                				        <span className='text-lg leading-5 font-medium select-text'>{ value }</span>
	                				    </div>

										{
											label === 'Peso' && !isAdmin ?
												<button
													type="button"
													onClick={ editWeight }
													className="print:hidden p-1 text-bunker-700 opacity-50 group-hover:opacity-100 transition-opacity duration-100"
													title="Editar peso"
												>
													<Edit/>
												</button>
											:
												null
										}
	                				    
	                				</div>
	        				    )
	        				}
	        				
	        			</li>
				    )
				}
			</ul>
			
			<ul className="flex flex-col print:flex-row items-center justify-start w-full divide-y print:divide-y-0 print:divide-x">
				{
				    info.map(({ label, value, editHandler }, ind) =>
				        <li key={ `row_${ ind }` }  className={cn(
							'group flex flex-col items-start justify-start py-3 pl-4 min-w-44 w-full gap-1',
							{ 'pb-0': ind === info.length - 1 }
						)}>

							<div className="flex items-center gap-2">
								<span className='text-sm leading-3 text-bunker-700'>{ label }</span>
								
								{
									!isAdmin ?
										<button
											type="button"
											onClick={ editHandler }
											className="print:hidden p-1 text-bunker-700 opacity-50 group-hover:opacity-100 transition-opacity duration-100"
											title={ `Editar ${ label.toLowerCase() }` }
										>
											<Edit className="w-4" />
										</button>
									:
										null
								}
							</div>
							<span className='text-base leading-5 font-medium select-text'>{ value }</span>
	        				
	        			</li>
				    )
				}
			</ul>
			
			<ul className="flex items-center justify-start w-full divide-x">
				{
				    record.map(({ label, value, timestamp }, ind) =>
				        <li 
							key={ `row_${ ind }` }
							className={cn(
								'flex flex-col items-start justify-start px-4 pt-3 min-w-44 gap-3',
								{ 'pr-0': ind === record.length - 1 }
							)}
						>
								
							<span className='text-sm leading-3 text-bunker-700'>{ label }</span>
							
							<div className='flex flex-col items-start justify-center gap-1'>
								<span className='text-sm leading-3 font-medium select-text'>{ value }</span>
								<time
									dateTime={ new Date(timestamp).toISOString().split('T')[0] }
									className='text-xs leading-3 text-bunker-800 italic select-text'
								>
									{
										new Date(timestamp).toLocaleString('es-VE', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})
									}
								</time>
							</div>
	        				
	        			</li>
				    )
				}
			</ul>

		</section>
	);
};

export default DonorInfo;