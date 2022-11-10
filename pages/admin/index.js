

export default async function( {query} ) {
	
	// const ratings = await process.query(`select ${query.q == 'all' ? `*` : 'rating'} from rating`)
	let { data, error } = await process.supabase
		.from('rating')
		.select('*');
		
	let table = ''
	let rate = e => e == 0 ? 'Senang' : e == 1 ? 'Biasa' : 'Kurang';
	for (let i = 0; i < data.length; i++) {
		table = table.concat(
			`
				<div>${data[i].urutan}</div>
				<div>${data[i].nama}</div>
				<div>${rate( data[i].rating )}</div>
				<div>${data[i].komentar}</div>
			`
		)
	}
	
	
	return {data : {table}}
}