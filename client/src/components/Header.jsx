import { useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";

import { GlobalState } from "@/GlobalState";

import Loading from "@components/Loading";

import USER from "@consts/user";

import Logout from "@icons/Logout";

const Header = () => {
	const navigate = useNavigate();
	const state = useContext(GlobalState);
	const { userAPI: { user }, session } = state;
	const [ logged, setLogged ] = session;
	const [ userData, setUserState ] = user;

	const logout = async () => {
		try {
			await axios.get('/user/logout');

			setLogged(false);
			navigate("/login", { replace: true });
			localStorage.clear();
			setUserState({
				user: null,
				isLogged: false,
				isAdmin: false
			});

			return toast.success("¡Sesión cerrada correctamente!");
		} catch (err) {
			toast.error(err.response.data);
		}
	};

	if (!logged) return null;

	if (!userData.isLogged) return (
		<header className='flex items-center px-8 min-h-16 border-b border-mercury-100'>
			<Loading size='20' stroke='1.5' color='var(--color-primary)' />
		</header>
	);
	
	const { user: { name, role } } = userData;

	return (
		<header className='flex print:hidden items-center sticky top-0 px-8 min-h-16 border-b border-mercury-100 bg-mercury-50 z-50'>
			<div className="flex flex-col justify-center h-full">
				<h4 className="text-lg leading-4 mr-8">{ name }</h4>
				<span className="text-sm font-light text-mercury-400">{ USER.ROLES[role].label }</span>
			</div>
			<nav className="flex flex-1 justify-end">
				<li>
					<Link
						to='/'
						onClick={ logout }
						aria-label='Cerrar sesión'
						className="flex items-center gap-2"
					>
						<span className='text-red-500'>Cerrar sesión</span>
						<Logout className='text-red-500' />
					</Link>
				</li>
			</nav>
		</header>
	);
};

export default Header;