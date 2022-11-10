


export async function get({query}) {
	let { data: rating, error } = await process.supabase
		.from('rating')
		.select('rating');
		
	return rating;
}




export async function post({post}) {	
	const { data, error } = await process.supabase
	.from('rating')
	.insert([
		{ nama: post.nama, rating: post.rating, komentar: post.komentar },
	]);
	console.log('insert return:',data,error || 'success')
		
	return data;
}








