import cn from "@lib/cn";

import Loading from "@components/Loading";

import StatsCard from "@sections/components/StatsCard";

import DONOR from "@consts/donor";

import Award from "@icons/Award";
import Droplet from "@icons/Droplet";
import Person from "@icons/Person";
import User from "@icons/User";
import WeightHanging from "@icons/WeightHanging";

const Status = ({ className, completed }) => {
	const STATUS = {
		COMPLETED: {
			classNames: 'border-green-300 text-green-700 bg-green-100',
			label: 'Completado'
		},
		ACTIVE: {
			classNames: 'border-orange-300 text-orange-700 bg-orange-100',
			label: 'En curso'
		}
	};

	const { classNames, label } = completed ? STATUS.COMPLETED : STATUS.ACTIVE;

	return (
		<div
			className={cn(
				'flex items-center justify-center px-2 py-1 border rounded-full font-medium',
				classNames,
				className
			)}
		>
			{ label }
		</div>
	);
};

const CardsHeader = ({ stats, loading }) => {
	const totalDonors = stats?.donors.total;
	const totalDonations = stats?.donations.total;
	const totalEligible = stats?.donors.eligibility.eligible / stats?.donors.total * 100 || 0;
	const avgWeight = parseInt(stats?.avgWeight);
	const avgAge = parseInt(stats?.avgAge);

	const donorsData = {
		title: 'Nuevos donantes',
		icon: <User className='text-green-500' />,
		value: totalDonors || 0
	};

	const donationsData = {
		title: 'Total de donaciones',
		icon: <Droplet className='text-red-500' />,
		value: totalDonations || 0
	};

	const eligibilityData = {
		title: 'Tasa de elegibilidad',
		icon: <Award className='text-amber-500' />,
		value: `${ Number.isInteger(totalEligible) ? totalEligible : totalEligible.toFixed(2) }%`
	};

	const weightAvg = {
		title: 'Peso promedio',
		icon: <WeightHanging className='text-blue-500' />,
		value: `${ avgWeight || 0 } Kg`
	};

	const ageAvg = {
		title: 'Edad promedio',
		icon: <Person className='text-violet-500' />,
		value: avgAge === 1 ? `${ avgAge } año` : `${ avgAge } años`
	};

	return (
		<header className="flex items-center justify-between w-full gap-4 print:gap-2">

			<StatsCard data={ donorsData } loading={ loading } />
			<StatsCard data={ donationsData } loading={ loading } />
			<StatsCard data={ eligibilityData } loading={ loading } />
			<StatsCard data={ weightAvg } loading={ loading } />
			<StatsCard data={ ageAvg } loading={ loading } />

		</header>
	);
};

const ByBloodType = ({ stats, loading }) => {
	const bloodTypes = (stats?.bloodType || []).map(({ bloodType, donationCount }) => {
		const donationRate = donationCount / stats.donations.total * 100 || 0;

		return {
			bloodType,
			donationRate,
			donationCount
		};
	});

	return (
		<div className="flex flex-col flex-1 items-center p-5 border border-mercury-200 rounded-md">
			{
				loading ?
					<Loading size='60' stroke='4' color='var(--color-primary)' />
				:
					<>
						<div className="w-full">
							<h3 className="text-xl font-semibold">Distribución por Tipo de Sangre</h3>
							<p className="text-sm text-mercury-700">Porcentaje de donaciones por grupo sanguíneo</p>
						</div>

						<ul className="flex flex-col mt-5 w-full gap-3 overflow-y-auto">
							{
								bloodTypes.map(({ bloodType, donationRate, donationCount }) => {
									return (
										<li
											key={ bloodType }
											className="flex items-center justify-between w-full gap-4"
										>
	
											<div className="flex items-center justify-center w-16 border border-mercury-200 rounded-full text-sm font-medium">
												{ bloodType }
											</div>
	
											<div className="flex flex-col w-full">
												<div className="flex justify-between w-full text-sm">
													<span className="font-medium">{ donationRate }%</span>
													<span className="text-mercury-800">{ donationCount } { donationCount > 1 || donationCount === 0 ? 'donaciones' : 'donación' }</span>
												</div>
	
												<div className="w-full h-[6px] rounded-full bg-mercury-300 overflow-hidden">
													<div className="w-full h-full bg-primary" style={{ transform: `translateX(-${ 100 - donationRate }%)` }}></div>
												</div>
											</div>
	
										</li>
									);
								})
							}
						</ul>
					</>
			}
		</div>
	);
};

const Donations = ({ stats, loading }) => {
	const donations = stats?.donations;

	return (
		<div className="flex flex-col flex-1 items-center p-5 border border-mercury-200 rounded-md">
			{
				loading ?
					<Loading size='60' stroke='4' color='var(--color-primary)' />
				:
					<>
						<div className="w-full">
							<h3 className="text-xl font-semibold">Donaciones</h3>
							<p className="text-sm text-mercury-700">Total de donaciones y porcentaje por estado</p>
						</div>

						<div className="flex flex-col print:flex-row items-center mt-5 w-full gap-3">

							<div className="flex flex-col items-center">
								<span className="text-3xl font-bold">{ donations.total }</span>
								<span className="text-sm text-mercury-700">{ donations.total > 1 || donations.total === 0 ? 'Donaciones' : 'Donación' }</span>
							</div>

							<div className="w-full print:w-[1px] h-[1px] print:h-full bg-mercury-200"></div>

							<ul className="flex flex-col w-full gap-3">
								{
									[
										{
											key: 'completed',
											label: {
												singular: 'completada',
												plural: 'completadas'
											}
										},
										{
											key: 'pending' ,
											label: {
												singular: 'en curso',
												plural: 'en curso'
											}
										}
									].map(({ key, label }) =>
										<li
											key={ key }
											className="flex items-center justify-between w-full gap-4"
										>
	
											<Status className='p-0 w-32 text-sm font-medium' completed={ key === 'completed' } />

											<div className="flex flex-col flex-1">
												<div className="flex justify-between w-full text-sm">
													<span className="font-medium">{ donations[ key ] / donations.total * 100 || 0 }%</span>
													<span className="text-mercury-800">{ donations[ key ] } { donations[ key ] > 1 || donations[ key ] === 0 ? label.plural : label.singular }</span>
												</div>

												<div className="w-full h-[6px] rounded-full bg-mercury-300 overflow-hidden">
													<div className="w-full h-full bg-primary" style={{ transform: `translateX(-${ 100 - ( donations[ key ] / donations.total * 100 || 0 ) }%)` }}></div>
												</div>
											</div>
										</li>
									)
								}
							</ul>

						</div>
					</>
			}
		</div>
	);
};

const ByGenre = ({ stats, loading }) => {
	const genres = (stats?.genres || []).map(({ genre, donationCount }) => {
		const donationRate = donationCount / stats.donations.total * 100 || 0;

		return {
			genre,
			donationRate,
			donationCount
		};
	});

	return (
		<div className="flex flex-col flex-1 items-center p-5 border border-mercury-200 rounded-md">
			{
				loading ?
					<Loading size='60' stroke='4' color='var(--color-primary)' />
				:
					<>
						<div className="w-full">
							<h3 className="text-xl font-semibold">Distribución por Género</h3>
							<p className="text-sm text-mercury-700">Porcentaje de donaciones por género</p>
						</div>

						<ul className="flex flex-col mt-5 w-full gap-3">
							{
								genres.map(({ genre, donationRate, donationCount }) => {
									return (
										<li
											key={ genre }
											className="flex items-center justify-between w-full gap-4"
										>
	
											<div className={cn(
												"flex items-center justify-center w-32 border border-accent-300 text-accent-700 bg-accent-100 rounded-full text-sm font-medium",
												{ 'border-pink-300 text-pink-700 bg-pink-100': genre === DONOR.GENRE[1] }
											)}>
												{ genre }
											</div>
	
											<div className="flex flex-col w-full">
												<div className="flex justify-between w-full text-sm">
													<span className="font-medium">{ donationRate }%</span>
													<span className="text-mercury-800">{ donationCount } { donationCount > 1 ? 'donaciones' : 'donación' }</span>
												</div>
	
												<div className="w-full h-[6px] rounded-full bg-mercury-300 overflow-hidden">
													<div className="w-full h-full bg-primary" style={{ transform: `translateX(-${ 100 - donationRate }%)` }}></div>
												</div>
											</div>
	
										</li>
									);
								})
							}
						</ul>
					</>
			}
		</div>
	);
};

const StatsBody = ({ stats, loading }) => {

	return (
		<section className="flex flex-col w-full h-full gap-5 overflow-hidden">
			
			<CardsHeader stats={ stats } loading={ loading } />

			<div className="flex print:flex-col justify-between gap-5 overflow-hidden">
				<Donations stats={ stats } loading={ loading } />
				<ByBloodType stats={ stats } loading={ loading } />
				<ByGenre stats={ stats } loading={ loading } />
			</div>

		</section>
	);
};

export default StatsBody;