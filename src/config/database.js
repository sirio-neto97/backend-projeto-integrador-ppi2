module.exports = {
	'dialect': 'postgres',
	'host': 'localhost',
	'username': 'postgres',
	'password': 'docker',
	'database': 'projeto_integrador',
	'define': {
		'timestamps': true,
		'underscored': true,
		'underscoredAll': true
	},
	'query': {
		'raw': true
	}
}