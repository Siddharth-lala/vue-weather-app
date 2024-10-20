const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public'))); // serves static prerendered file from public folder

app.listen(8080, () => {
	console.log('Frontend server is running on http://localhost:8080');
});
