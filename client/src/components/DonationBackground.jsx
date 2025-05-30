import donationImg from '@assets/images/image_1.webp';

const DonationBackground = () => {
	return (
		<div className='hidden dark:block absolute top-0 left-0 w-full h-full [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)] overflow-hidden opacity-85 -z-10'>
			<figure className='w-full h-full'>
				<img
					src={ donationImg }
					draggable={ false }
					onContextMenu={ e => e.preventDefault() }
					className='w-full h-full object-cover blur-sm'
				/>
			</figure>
		</div>
	);
};

export default DonationBackground;