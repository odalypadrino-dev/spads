import { useState, useEffect } from "react";

import cn from "@lib/cn";

import Fieldset from "@components/Fieldset";

import MagnifyingGlass from "@icons/MagnifyingGlass";

const DonorSearch = ({ searchState }) => {
	const [ search, setSearch ] = searchState;
	const [ value, setValue ] = useState('');

	const handleInput = e => {
		const { value } = e.target;
		setValue(value);
	};

	const handleSearch = search => setSearch(search);

	useEffect(() => {
		if (!value) return handleSearch('');

		const delay = setTimeout(() => handleSearch(value), 500);

		return () => clearTimeout(delay);
	}, [ value ]);
	
	return (
		<section className="flex shrink-0 flex-col items-start justify-start p-5 w-full border border-mercury-200 rounded-lg gap-5">

			<h3 className="text-2xl font-semibold">Buscar Donantes</h3>
	
			<Fieldset.Field>

				<Fieldset.Field.Container
					label='Buscar por cédula (VXXXXXXXX) o número de historia (#XXXX)' 
					hasDecorator
					classNames={{
						label: 'text-mercury-500',
						placeholder: 'text-mercury-500'
					}}
				>

					<Fieldset.Field.Container.Input
						className={cn(
							'border-mercury-200 bg-transparent',
							{ 'filled': search.length }
						)}
						value={ value }
						onChange={ handleInput }
						autoComplete='off'
					/>

					<MagnifyingGlass />

				</Fieldset.Field.Container>

				<Fieldset.Field.Description><strong>Ejemplos:</strong> V123456789, #0012, o #0012 V123456789</Fieldset.Field.Description>

			</Fieldset.Field>

		</section>
	);
};

export default DonorSearch;