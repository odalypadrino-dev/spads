import axios from '@lib/axios';

const RootAPI = () => {
	const getLogs = async (
		signal = undefined,
		{ search = '', page = 1, limit = 10, } = {}
	) => {
		try {
			const queryParams = new URLSearchParams({
				search: search.trim(),
				page,
				limit
			}).toString();

			const { data } = await axios.get(`/api/logs?${ queryParams }`, { ...(signal ?? {}) });

			return data;
		} catch (err) {
			console.log(err);
		};
	};

	return {
		getLogs
	};
};

export default RootAPI;