

const headers = document.querySelectorAll('.head')
const container = document.querySelector('.container')
const create = inn => {
	const out = document.createElement('div');
	out.innerText = inn;
	return out;
}
const ratingMap = [
	'','Senang','Biasa','Kurang'
]

async function pull() {
	/** @type {{urutan,nama,rating,komentar}[]} */
	const data = await fetch(
		'/api/db?m=a',
		{method : "get"}
	).then(e=>e.json())
	
	document.querySelector('h1').style.display = 'none';
	headers.forEach(e=>e.style.visibility = 'visible');
	
	data.forEach( e =>{
		Object.entries(e).forEach( ([k,v]) => {container.appendChild( create(k=='rating' ? ratingMap[v] : v) )})
	})
	
}

pull();