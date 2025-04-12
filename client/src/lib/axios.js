import ax from "axios";

const axios = ax.create();

axios.interceptors.request.use(
	async request => {
		const accessToken = localStorage.getItem('accessToken');

		if (accessToken) request.headers['Authorization'] = accessToken;

		return request;
	}, error => { return Promise.reject(error); });

axios.interceptors.response.use(
	async response => {
		const originalRequest = response.config;
		
		if (response.data.status === 400 && response.data.content.includes && response.data.content.includes('jwt expired') && !originalRequest._retry) {
			originalRequest._retry = true;
			
			try {
				const res = await ax.get('/user/a983bfd8826c0c5cd605a6370cfe02');
				const { data: { content: accessToken, success } } = res;

				if (success) {
					localStorage.setItem('accessToken', accessToken);
					axios.defaults.headers.common['Authorization'] = accessToken;
					originalRequest.headers['Authorization'] = accessToken;
				};

				if (!success) {
					localStorage.clear();
					window.location.href = '/login';
					return;
				};

				return axios(originalRequest);
			} catch (err) {
				localStorage.clear();
				window.location.href = '/login';
				return Promise.reject(err);
			};
		};

		return response;
	}
);

export default axios;