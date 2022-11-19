
const display = document.querySelectorAll('[ref]');
console.log(display)

window.pull = async () => {
	const data = await fetch(
		`/api/db`,
		{method : 'get'}
	).then(e=>e.json())
	
	//================================================================
	
	let [senang,biasa,kurang] = [0,0,0];
	data.forEach( r => {
		if (r.rating == 1){
			senang++;
		}
		else if (r.rating == 2){
			biasa++;
		}
		else if (r.rating == 3){
			kurang++;
		}
	});
	
	display[0].innerHTML = senang;
	display[1].innerHTML = biasa;
	display[2].innerHTML = kurang;
};



window.push = async (c) => {
	const elNama = document.querySelector('.nama');
	const elKomentar = document.querySelector('.komentar');
	const o = document.querySelector('.noinp');
	
	if (elNama.value == '' && elKomentar.value == ''){
		o.style.color = 'red';
		o.innerHTML = `Tolong masukan nama dan kesan`
		return;
	}
	
	const data = {
		nama : document.querySelector('.nama').value,
		rating : c,
		komentar : document.querySelector('.komentar').value
	}
	
	o.style.color = 'lime'
	o.innerHTML = `Terima Kasih atas masukan anda`
	elNama.value = ''
	elKomentar.value = ''
	
	const elems = document.querySelectorAll('#data-mati');
	elems.forEach(e => {e.innerHTML = 'loading...'});
	
	await window.pull();
	
};


window.pull();