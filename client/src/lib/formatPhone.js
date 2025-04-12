const formatPhone = num => {
	const str = num.toString().replace(/\D/g, '');

	if (str.length !== 11 || !(str.startsWith('0212') || str.startsWith('04'))) return num;

	return str.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
};

export default formatPhone;