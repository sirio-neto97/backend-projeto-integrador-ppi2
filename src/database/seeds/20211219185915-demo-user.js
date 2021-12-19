'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('users', [{
			name: 'Administrador',
			email: 'admin@gmail.com',
			password_hash: '$2a$12$6HA5a4cyKuhA/Y99kb71DupzTBciOc6gGVCIqVroJFmfqJY71sMne', //1234567
			created_at: new Date(),
			updated_at: new Date()
		}]);
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('People', null, {});
	}
};
