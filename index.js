import { listen } from "./server/router.js";
import { readFile } from "fs/promises";
import { readdirRecursive } from "./server/utility.js";

// todo: error handling

process.error = er => `<h1>Error ! 🐞</h1><p>${er}</p>`
process.template = await readFile(`src/template.html`,'utf-8');
process.meta = JSON.parse( await readFile('deuzo.json','utf-8') )

// serving public
if (process.meta.public){
	process.public = await readdirRecursive(process.meta.public);
}

await import('./src/index.js').catch( ()=>{} )


listen(process.env.PORT, p => console.log(`listening in ${p}...`))