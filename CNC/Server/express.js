const express = require('express');
const app     = express();

app.get('/', (req, res) => {
	res.send('Hello world!');
});

app.get('/kek', (req, res) => {
	res.send('Hello wor- kek!!1!!');
});

app.listen(3000, () => {
	console.log('Example listening on http://localhost:3000');
});
