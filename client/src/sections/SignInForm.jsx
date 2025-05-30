import { useState, useRef } from "react";
import { Link } from 'react-router-dom';

import Form from "@components/Form";
import Fieldset from "@components/Fieldset";
import Loading from "@components/Loading";

import USER from "@consts/user";

import Id from "@icons/Id";
import SquareLockPassword from "@icons/SquareLockPassword";
import View from "@icons/View";
import ViewOff from "@icons/ViewOff";

const SignInForm = ({ ci, password, keepSession, loading, onChange, onSubmit }) => {
	const [ showPass, setShowPass ] = useState(false);
	const passwordRef = useRef(null);

	const onBlur = e => {
		e.preventDefault();
		if (e.relatedTarget && e.relatedTarget.classList.contains("input__showPassword")) passwordRef.current.focus();
	};

	return (
		<section className="flex items-center justify-center p-10 rounded-xl bg-mercury-50">
			<Form onSubmit={ onSubmit }>
				
				<Fieldset title='Inicia sesión'>
		
					<Fieldset.Field>
						<Fieldset.Field.Container
							label='Cédula'
							htmlFor='ci'
							hasDecorator
						>
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
		
					<Fieldset.Field>
						<Fieldset.Field.Container
							label='Contraseña'
							htmlFor='password'
							onEvents={{ onBlur }}
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
								disabled={ loading }
								required
								minLength={ USER.PASSWORD.MIN_LENGTH }
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
						<Fieldset.Field.Container classNames={{ base: 'gap-2' }}>
							<Fieldset.Field.Container.Checkbox
								label='Mantener la sesión iniciada'
								htmlFor='keepSession'
								name='keepSession'
								id='keepSession'
								checked={ keepSession }
								onChange={ onChange }
								disabled={ loading }
							/>
						</Fieldset.Field.Container>
					</Fieldset.Field>

				</Fieldset>
	
				<Form.Footer>
					
					<Form.Footer.Buttons>
						<button type='submit' className={ loading ? 'loading' : null }>
							<span>
								{ loading ? <Loading size="16" stroke="1.5" color="var(--color-secondary)" /> : null }
								Iniciar sesión
							</span>
						</button>
					</Form.Footer.Buttons>
	
					<Form.Footer.Message>
						¿No tienes una cuenta? <Link to='../register'>¡Crea una!</Link>
					</Form.Footer.Message>
	
				</Form.Footer>

			</Form>
		</section>
	);
};

export default SignInForm;