import axios from '@lib/axios';

const DonorAPI = () => {
	const getById = async donorId => {
		try {
			const { data } = await axios.get(`/api/donor/${ donorId }`);

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	const getDonors = async (
		signal = undefined,
		{ search = '', page = 1, limit = 10, } = {}
	) => {
		try {
			const queryParams = new URLSearchParams({
				search: search.trim(),
				page,
				limit
			}).toString();

			const { data } = await axios.get(`/api/donor?${ queryParams }`, { ...(signal ?? {}) });

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	const addDonor = async donorData => {
		try {
			const { data } = await axios.post('/api/donor/register', donorData);

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	const updateDonor = async (donorId, newData) => {
		try {
			const { data } = await axios.patch(`/api/donor/${ donorId }/edit`, newData);

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	const addHealthCondition = async (donorId, hcData) => {
		try {
			const { data } = await axios.post(`/api/donor/${ donorId }/healthCondition`, hcData);

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	const getHealthConditions = async (
		donorId,
		signal = undefined,
		{ page = 1, limit = 6 } = {}
	) => {
		try {
			const queryParams = new URLSearchParams({ page, limit }).toString();

			const { data } = await axios.get(`/api/donor/${ donorId }/healthCondition?${ queryParams }`, { ...(signal ?? {}) });

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	const endHealthCondition = async (donorId, hcId, endData) => {
		try {
			const { data } = await axios.patch(`/api/donor/${ donorId }/healthCondition/${ hcId }/end`, endData);

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	const addBloodTest = async (donorId, btData) => {
		try {
			const { data } = await axios.post(`/api/donor/${ donorId }/bloodTest`, btData);

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	const getBloodTest = async (
		donorId,
		signal = undefined,
		{ page = 1, limit = 6 } = {}
	) => {
		try {
			const queryParams = new URLSearchParams({ page, limit }).toString();

			const { data } = await axios.get(`/api/donor/${ donorId }/bloodTest?${ queryParams }`, { ...(signal ?? {}) });

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	const addDonation = async (donorId, donationData) => {
		try {
			const { data } = await axios.post(`/api/donor/${ donorId }/donation`, donationData);

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	const getDonations = async (
		donorId,
		signal = undefined,
		{ page = 1, limit = 6 } = {}
	) => {
		try {
			const queryParams = new URLSearchParams({ page, limit }).toString();

			const { data } = await axios.get(`/api/donor/${ donorId }/donation?${ queryParams }`, { ...(signal ?? {}) });

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	const completeDonation = async (donorId, dntId) => {
		try {
			const { data } = await axios.patch(`/api/donor/${ donorId }/donation/${ dntId }/complete`);

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	const donAvail = async (donorId, key = false) => {
		try {
			const queryParams = new URLSearchParams({ key }).toString();
			const { data } = await axios.get(`/api/donor/${ donorId }/checkDonate?${ queryParams }`);

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	return {
		donors: {
			addDonor,
			getById,
			getDonors,
			updateDonor
		},
		healthConditions: {
			addHealthCondition,
			getHealthConditions,
			endHealthCondition
		},
		bloodTests: {
			addBloodTest,
			getBloodTest
		},
		donations: {
			addDonation,
			getDonations,
			completeDonation,
			donAvail
		}
	};
};

export default DonorAPI;