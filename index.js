const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const port = 3000;

var cors = require('cors')
const fs = require('fs');
const IPFS = require('ipfs');

// default options
app.use(fileUpload());
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.use(cors());

app.post('/upload', async function (req, res) {
	let sampleFile;
	let uploadPath;
	let ipfs = await IPFS.create()

	console.log(ipfs);
	/*fs.rmSync( __dirname + '/files/', { recursive: true });
	fs.mkdirSync( __dirname + '/files/',{recursive:true});*/


	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	sampleFile = req.files.file;

	uploadPath = __dirname + '/files/' + sampleFile.name;
	await fs.unlink(__dirname + '/files/' + sampleFile.name, function (err) {
		if (err) {
			console.error(err);
		}
		console.log('File has been Deleted');
	});
	// Use the mv() method to place the file somewhere on your server
	await sampleFile.mv(uploadPath,async function (err) {
		if (err)
			return res.status(500).send(err);
			let hash = await  ipfs.add(uploadPath);
		res.json({
			"data": sampleFile.name,
			"hash":hash
		});
	});

});




app.post("/files", function (req, res) {


});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})