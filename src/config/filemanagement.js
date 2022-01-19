const { resolve } = require('path');

module.exports = {
	'fileUploadConfig': {
		'safeFileNames': true,
		'preserveExtension': true
	},
	'public': {
		'path': resolve(__dirname, '..', '..', 'tmp', 'uploads')
	}
}