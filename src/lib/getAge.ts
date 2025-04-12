const getAge = (birthdate: string) => {
	const birthDate = new Date(birthdate);
	const today = new Date();

	const age = today.getFullYear() - birthDate.getFullYear();

	const monthDifference = today.getMonth() - birthDate.getMonth();
	const dayDifference = today.getDate() - birthDate.getDate();

	if (monthDifference < 0 || dayDifference < 0) return age - 1;

	return age;
};

export default getAge;