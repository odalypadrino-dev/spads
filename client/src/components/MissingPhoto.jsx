import cn from '@lib/cn';

import User from '@icons/User';

const MissingPhoto = ({ className }) => {
	return (
		<div
		    className={cn(
		        'flex items-center justify-center aspect-square text-link-water-300 bg-link-water-100',
		        className
		    )}
		>
			<User className='w-3/5' />
		</div>
	);
};

export default MissingPhoto;