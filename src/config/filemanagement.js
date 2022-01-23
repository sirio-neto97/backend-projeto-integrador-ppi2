const { resolve } = require('path');
const { path } = require('./environment')

module.exports = {
	'fileUploadConfig': {
		'safeFileNames': true,
		'preserveExtension': true
	},
	'public': {
		'path': resolve(path, 'tmp', 'uploads')
	}
}