const USER = {
	CI: {
		MIN_LENGTH: 8,
		MAX_LENGTH: 9
	},
	FIRST_NAME: {
		MIN_LENGTH: 3
	},
	LAST_NAME: {
		MIN_LENGTH: 3
	},
	PASSWORD: {
		MIN_LENGTH: 6
	},
	ROLES: {
		ADMIN: {
			value: 'ADMIN',
			label: 'Administrador'
		},
		USER: {
			value: 'USER',
			label: 'Usuario'
		},
		ROOT: {
			value: 'ROOT',
			label: 'Superusuario'
		}
	}
};

export default USER;