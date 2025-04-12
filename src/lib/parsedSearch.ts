const parsedSearch = (search: string) => search.trim().split(' ').map(term => `+${ term }*`).join(' ');

export default parsedSearch;