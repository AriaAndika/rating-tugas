

export default function( {query} ) {
	
	// const ratings = await process.query(`select ${query.q == 'all' ? `*` : 'rating'} from rating`)
	// let { data: ratings, error } = await process.supabase
	// 	.from('rating')
	// 	.select('rating');
		
	let [senang,biasa,kurang] = [0,0,0];
	
	ratings.forEach( r => {
		if (r.rating == 1){
			senang++;
		}
		else if (r.rating == 2){
			biasa++;
		}
		else if (r.rating == 3){
			kurang++;
		}
	})
	
	return {data : {senang,biasa,kurang}}
}