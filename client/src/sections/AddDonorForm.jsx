import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";

import Form from '@components/Form';
import Fieldset from '@components/Fieldset';
import Loading from '@components/Loading';

import DONOR from '@consts/donor';

import CalendarDay from "@icons/CalendarDay";
import LocationDot from "@icons/LocationDot";
import UserQuestion1 from '@icons/UserQuestion1';
import UserQuestion2 from '@icons/UserQuestion2';
import Phone from "@icons/Phone";
import VenusMars from "@icons/VenusMars";
import WeightHanging from "@icons/WeightHanging";

const AddDonorForm = ({ donorData, onChange, onSubmit, loading, formValid }) => {
	const {
		names,
		surnames,
		letter,
		number,
		birthdate,
		genre,
		phone,
		dir,
		weight
	} = donorData;

	const setValue = (name, value) => onChange({ target: { name, value } });

	return (
		<section className='flex items-center justify-center'>
			<Form onSubmit={ onSubmit } data-invalid={ !formValid }>

				<Fieldset
					title='Añade un nuevo donante'
					classNames={{
						base: 'items-start',
						label: 'text-2xl text-left',
						content: 'flex-row items-start mt-12'
					}}
				>

					<div className="flex flex-col gap-3">
						<Fieldset.Field>
							<Fieldset.Field.Container label='Nombres' htmlFor='names' hasDecorator>
								<Fieldset.Field.Container.Input
									className={ names.length ? 'filled' : '' }
									type="text"
									name="names"
									id="names"
									value={ names }
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
							<Fieldset.Field.Container label='Apellidos' htmlFor='surnames' hasDecorator>
								<Fieldset.Field.Container.Input
									className={ surnames.length ? 'filled' : '' }
									type="text"
									name="surnames"
									id="surnames"
									value={ surnames }
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
	
							<Fieldset.Field.Container label='Cédula' htmlFor='number' hasDecorator>
	
								<Fieldset.Field.Container.Input
									className={ number.length ? 'filled' : '' }
									type="text"
									inputMode="numeric"
									name="number"
									id="number"
									value={ number }
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
											{ letter }
										</Button>
									</DropdownTrigger>
									
									<DropdownMenu
										aria-label="Seleccionar el tipo de la cédula"
										variant="flat"
										disallowEmptySelection
										selectionMode="single"
										selectedKeys={ letter }
										onSelectionChange={ e => setValue('letter', [...e][0]) }
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
	
						<Fieldset.Field>
	
							<Fieldset.Field.Container label='Fecha de nacimiento' htmlFor='birthdate' hasDecorator>
	
								<Fieldset.Field.Container.Input
									className='filled'
									type="date"
									name="birthdate"
									id="birthdate"
									value={ birthdate }
									onChange={ onChange }
									disabled={ loading }
									required
									max={ new Date().toLocaleDateString('en-ca') }
								/>
								
								<CalendarDay />
	
							</Fieldset.Field.Container>
	
						</Fieldset.Field>
					</div>

					<div className="flex flex-col gap-3">

						<Fieldset.Field>
							<Fieldset.Field.Container>

								<Fieldset.Field.Container.Dropdown
									{...{
										label: 'Género',
										name: 'genre',
										selected: genre,
										items: DONOR.GENRE.map(g => ({ value: g, label: g })),
										decorator: <VenusMars />,
										onChange: e => onChange({ target: e }),
										'aria-disabled': loading,
										'aria-required': true
									}}
								/>

							</Fieldset.Field.Container>
						</Fieldset.Field>

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

						<Fieldset.Field>

							<Fieldset.Field.Container label='Dirección' htmlFor='dir' hasDecorator>

								<Fieldset.Field.Container.Input
									className={ dir.length ? 'filled' : '' }
									type="text"
									name="dir"
									id="dir"
									value={ dir }
									onChange={ onChange }
									autoComplete='off'
									disabled={ loading }
									required
									minLength={ DONOR.DIR.MIN_LENGTH }
									maxLength={ DONOR.DIR.MAX_LENGTH }
								/>
								
								<LocationDot />
								
							</Fieldset.Field.Container>

						</Fieldset.Field>

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

					</div>

				</Fieldset>

				<Form.Footer>
					<Form.Footer.Buttons>
						<button type="submit" className={ loading ? 'loading' : null }>
							<span>
								{ loading ? <Loading size="16" stroke="1.5" color="var(--color-secondary)" /> : null }
								Añadir donante
							</span>
						</button>
					</Form.Footer.Buttons>
				</Form.Footer>

			</Form>
		</section>
	);
};

export default AddDonorForm;