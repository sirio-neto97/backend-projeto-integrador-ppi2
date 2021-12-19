'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('companies', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			nome: {
				type: Sequelize.STRING,
				allowNull: false
			},
			cnpj: {
				type: Sequelize.STRING(18),
			},
			sobre: {
				type: Sequelize.STRING,
				allowNull: false
			},
			localizacao:{
				type: Sequelize.STRING,
			},
			email:{
				type: Sequelize.STRING,
				allowNull: false
			},
			telefone: {
				type: Sequelize.STRING,
				allowNull: false
			},
			whatsapp: {
				type: Sequelize.STRING,
				allowNull: false
			},
			instagram: {
				type: Sequelize.STRING,
			},
			facebook: {
				type: Sequelize.STRING,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false
			}
		});
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.dropTable('company');
	}
};
