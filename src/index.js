import { createConnection } from "mysql";
import { promisify } from "util";

/** @type {import("mysql").Connection} */
const db = createConnection({
	host: "localhost",
  user: "root",
  password: "dbwong",
	database : "rating"
});

db.connect(err=>{
	if (err) throw err;
	console.log("DB Connected...")
})

process.query = promisify(db.query).bind(db);

// console.log(
	
// 	await process.query(`INSERT INTO rating (nama, rating, komentar) VALUES ('Aria',2,'lantainya licin')`)
// 	await process.query(`select * from rating`)
// )








