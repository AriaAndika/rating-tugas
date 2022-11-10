


export async function get({query}) {
	
	const ratings = await process.query(`select ${query?.q == 'all' ? `*` : 'rating'} from rating`)
	let [senang,biasa,kurang] = [0,0,0]
	
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
	
	return {senang,biasa,kurang};
}



export async function post({post}) {
	
	await process.query(`INSERT INTO rating (nama, rating, komentar) VALUES ('${post.nama}',${post.rating},'${post.komentar}');`);
	
	// return await get();
}