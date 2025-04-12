import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import Form from '@components/Form';
import Fieldset from '@components/Fieldset';
import Loading from '@components/Loading';

import USER from '@consts/user';

import Id from "@icons/Id";
import PasswordValidation from '@icons/PasswordValidation';
import SquareLockPassword from "@icons/SquareLockPassword";
import UserQuestion1 from '@icons/UserQuestion1';
import UserQuestion2 from '@icons/UserQuestion2';
import View from "@icons/View";
import ViewOff from "@icons/ViewOff";

const SignUpForm = ({ firstName, lastName, ci, password, confirmPassword, loading, onChange, onSubmit }) => {
	const [ showPass, setShowPass ] = useState(false);
	const [ showCPass, setShowCPass ] = useState(false);
	const passwordRef = useRef(null);
	const cpassRef = useRef(null);

	const onBlurPass = e => {
		e.preventDefault();
		if (e.relatedTarget && e.relatedTarget.classList.contains("input__showPassword")) passwordRef.current.focus();
	};

	const onBlurCPass = e => {
		e.preventDefault();
		if (e.relatedTarget && e.relatedTarget.classList.contains("input__showPassword")) passwordRef.current.focus();
	};

	return (
		<section className='flex items-center justify-center mt-20'>
			<Form onSubmit={ onSubmit }>

				<Fieldset
					title='Crea una cuenta'
					classNames={{
						content: 'flex-row items-start'
					}}
				>
	
					<div className='flex flex-col gap-3'>
						<Fieldset.Field>
							
							<Fieldset.Field.Container label="Nombre" htmlFor="firstName" hasDecorator>
								<Fieldset.Field.Container.Input
									className={ firstName.length ? 'filled' : '' }
									type="text"
									name="firstName"
									id="firstName"
									value={ firstName }
									onChange={ onChange }
									autoComplete="given-name"
									required
									minLength={ USER.FIRST_NAME.MIN_LENGTH }
								/>
		
								<UserQuestion2 />
							</Fieldset.Field.Container>
		
						</Fieldset.Field>
		
						<Fieldset.Field>
							
							<Fieldset.Field.Container label="Apellido" htmlFor="lastName" hasDecorator>
								<Fieldset.Field.Container.Input
									className={ lastName.length ? 'filled' : '' }
									type="text"
									name="lastName"
									id="lastName"
									value={ lastName }
									onChange={ onChange }
									autoComplete="family-name"
									required
									minLength={ USER.LAST_NAME.MIN_LENGTH }
								/>
		
								<UserQuestion1 />
							</Fieldset.Field.Container>
		
						</Fieldset.Field>
		
						<Fieldset.Field>
							
							<Fieldset.Field.Container label="Cédula" htmlFor="ci" hasDecorator>
								<Fieldset.Field.Container.Input
									className={ ci.length ? 'filled' : '' }
									type="text"
									inputMode="numeric"
									name="ci"
									id="ci"
									value={ ci }
									onChange={ onChange }
									onBeforeInput={ e => {
										const { data } = e;
										if (!(Number(data) >= 0 && Number(data) <= USER.CI.MAX_LENGTH)) return e.preventDefault();
									}}
									disabled={ loading }
									required
									minLength={ USER.CI.MIN_LENGTH }
									maxLength={ USER.CI.MAX_LENGTH }
								/>
		
								<Id />
							</Fieldset.Field.Container>
		
						</Fieldset.Field>
					</div>
				
					<div className='flex flex-col gap-3'>
						<Fieldset.Field>
							<Fieldset.Field.Container
								label="Contraseña"
								htmlFor="password"
								onEvents={{ onBlur: onBlurPass }}
								hasDecorator
							>
								<Fieldset.Field.Container.Input
									className={ password.length ? 'filled' : '' }
									type={ showPass ? 'text' : 'password' }
									name="password"
									id="password"
									value={ password }
									onChange={ onChange }
									onFocus={ e => e.currentTarget.selectionStart = e.currentTarget.value.length }
									required
									minLength={ USER.PASSWORD.MIN_LENGTH }
									autoComplete="new-password"
									ref={ passwordRef }
								/>
				
								<SquareLockPassword />
				
								<div
									className="endContent"
									role="button"
									onClick={ () => setShowPass(!showPass) }
									onMouseUp={ e => e.preventDefault() }
									tabIndex="1"
								>
									{ showPass ? <View /> : <ViewOff /> }
								</div>
							</Fieldset.Field.Container>
		
						</Fieldset.Field>
						
						<Fieldset.Field>
							<Fieldset.Field.Container
								label="Repetir contraseña"
								htmlFor="confirmPassword"
								onEvents={{ onBlur: onBlurCPass }}
								hasDecorator
							>
								<Fieldset.Field.Container.Input
									className={ confirmPassword.length ? 'filled' : '' }
									type={ showCPass ? 'text' : 'password' }
									name="confirmPassword"
									id="confirmPassword"
									value={ confirmPassword }
									onChange={ onChange }
									onFocus={ e => e.currentTarget.selectionStart = e.currentTarget.value.length }
									required
									minLength={ USER.PASSWORD.MIN_LENGTH }
									autoComplete="new-password"
									ref={ cpassRef }
								/>
				
								<PasswordValidation />
				
								<div
									className="endContent"
									role="button"
									onClick={ () => setShowCPass(!showCPass) }
									onMouseUp={ e => e.preventDefault() }
									tabIndex="1"
								>
									{ showCPass ? <View /> : <ViewOff /> }
								</div>
							</Fieldset.Field.Container>
		
						</Fieldset.Field>
					</div>
	
				</Fieldset>

				<Form.Footer>

					<Form.Footer.Buttons>
						<button type='submit' className={ loading ? 'loading' : null }>
							<span>
								{ loading ? <Loading size="16" stroke="1.5" color="var(--color-secondary)" /> : null }
								Crear cuenta
							</span>
						</button>
					</Form.Footer.Buttons>

					<Form.Footer.Message>¿Tienes una cuenta? <Link to='../login'>¡Inicia sesión!</Link></Form.Footer.Message>

				</Form.Footer>

			</Form>
		</section>
	);
};
export default SignUpForm;