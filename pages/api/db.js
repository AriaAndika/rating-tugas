


export async function get({query}) {
	let { data: rating, error } = await process.supabase
		.from('rating')
		.select(query.m == 'a' ? '*' : 'rating');
		
	return rating;
}

export async function options({postData}) {
	return post({postData});
}


export async function post({post}) {	
	const { data, error } = await process.supabase
	.from('rating')
	.insert([
		{ nama: post.nama, rating: post.rating, komentar: post.komentar },
	]);
	console.log('write:',`\n${post}`,error || 'success')
		
	// return data;
}








