import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

import { GlobalState } from "@/GlobalState";

import StatsBody from "@sections/StatsBody";
import StatsHeader from "@sections/StatsHeader";

const Stats = () => {
	const navigate = useNavigate();
	const state = useContext(GlobalState);
	const { adminAPI: { getStats } } = state;
	const [ loading, setLoading ] = useState(true);
	const [ timeRange, setTimeRange ] = useState('month');
	const [ stats, setStats ] = useState(null);

	const fetchStats = async (timeRange, signal) => {
		setLoading(true);

		const { status, success, content } = await getStats(timeRange, signal);

		if (status === 500) {
			toast.error("Error en el servidor.");
			return navigate('/');
		};

		if (!success) {
			toast.error(content);
			return navigate('/');
		};

		setStats(content);
		setLoading(false);
	};

	useEffect(() => {
		const signal = new AbortController();

		fetchStats(timeRange, signal);

		return () => signal.abort();
	}, [ timeRange ]);

	return (
		<main className="flex flex-col items-center justify-start px-16 print:px-5 py-5 w-full gap-5 overflow-hidden">

			<StatsHeader
				time={ stats?.time }
				timeState={[ timeRange, setTimeRange ]}
				loading={ loading }
			/>

			<StatsBody stats={ stats?.data } loading={ loading } />

		</main>
	);
};

export default Stats;