import axios from '@lib/axios';

const AdminAPI = () => {
	const getStats = async (timeRange = 'month', signal) => {
		try {
			const queryParams = new URLSearchParams({ timeRange }).toString();

			const { data } = await axios.get(`/api/stats?${ queryParams }`, { ...(signal ?? {}) });

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	return {
		getStats
	};
};

export default AdminAPI;