import { useState, useEffect } from "react";

import cn from "@lib/cn";

import Fieldset from "@components/Fieldset";

import USER from "@consts/user";

import MagnifyingGlass from "@icons/MagnifyingGlass";

const LogSearch = ({ searchState }) => {
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

			<h3 className="text-2xl font-semibold">Buscar acciones</h3>
	
			<Fieldset.Field>

				<Fieldset.Field.Container
					label='Buscar por número de cédula' 
					hasDecorator
					classNames={{
						label: 'text-mercury-500',
						placeholder: 'text-mercury-500'
					}}
				>

					<Fieldset.Field.Container.Input
						inputMode="numeric"
						className={cn(
							'border-mercury-200 bg-transparent',
							{ 'filled': search.length }
						)}
						value={ value }
						onChange={ handleInput }
						onBeforeInput={ e => {
							const { data } = e;
							if (!(Number(data) >= 0 && Number(data) <= USER.CI.MAX_LENGTH)) return e.preventDefault();
						}}
						maxLength={ USER.CI.MAX_LENGTH }
						autoComplete='off'
					/>

					<MagnifyingGlass />

				</Fieldset.Field.Container>

				<Fieldset.Field.Description><strong>Ejemplos:</strong> 123456789, 12345, 1234567</Fieldset.Field.Description>

			</Fieldset.Field>

		</section>
	);
};

export default LogSearch;