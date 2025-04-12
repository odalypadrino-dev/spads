import Loading from "@components/Loading";

const StatsCard = ({ data, loading }) => {
	const { title, value, icon } = data;

	return (
		<div className="flex flex-1 flex-col items-center justify-center p-5 print:p-3 h-[6.5rem] print:h-full border border-mercury-200 rounded-md">
			{
				loading ?
					<Loading size='50' color='var(--color-primary)' stroke='3' />
				:
					<div className="flex flex-col justify-between w-full h-full">
						<div className="flex items-center print:items-start justify-between w-full [&>svg]:w-4 [&>svg]:aspect-square">
							<h3 className="text-sm font-medium">{ title }</h3>
							{ icon }
						</div>
		
						<span className="text-3xl print:text-2xl font-bold">{ value }</span>
					</div>
			}
		</div>
	);
};

export default StatsCard;