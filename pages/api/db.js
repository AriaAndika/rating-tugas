


export async function get({query}) {
	let { data: rating, error } = await process.supabase
		.from('rating')
		.select(query.m == 'a' ? '*' : 'rating');
		
	return rating;
}

export async function options({postData}) {
	const { data, error } = await process.supabase
	.from('rating')
	.insert([
		{ nama: postData.nama, rating: postData.rating, komentar: postData.komentar },
	]);
	console.log('write:',`\n${postData}`,error || 'success')
		
	// return data;
}


export async function post({postData}) {	
	const { data, error } = await process.supabase
	.from('rating')
	.insert([
		{ nama: postData.nama, rating: postData.rating, komentar: postData.komentar },
	]);
	console.log('write:',`\n${postData}`,error || 'success')
		
	// return data;
}








