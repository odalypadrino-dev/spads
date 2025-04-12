import cn from "@lib/cn";

const Tags = ({ selected, all, tags, onClick, ...props }) => {
	return (
		<ul { ...props }>

			{
				all ?
					<li
						className={cn(
							'flex items-center justify-center px-2 py-1 rounded text-sm text-primary border border-link-water-300 bg-link-water-50 transition-colors-opacity duration-100 gap-2 select-none hover:border-link-water-400 hover:bg-link-water-300',
							{ 'active': selected.includes(all.value) }
						)}
						onClick={ () => onClick(all.value) }
					>
						{ all.label }
					</li>
				:
					null
			}

			{
				tags.map((tag, ind) =>
					<li
						key={ ind }
						className={cn(
							'flex items-center justify-center px-2 py-1 rounded text-sm text-primary border border-link-water-300 bg-link-water-50 transition-colors-opacity duration-100 gap-2 select-none hover:border-link-water-400 hover:bg-link-water-300',
							{ 'active': selected.includes(tag.value) }
						)}
						onClick={ () => onClick(tag.value) }
					>
						{ tag.label }
					</li>
				)
			}

		</ul>
	);
};

export default Tags;