'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('announcements', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			marca: {
				type: Sequelize.STRING(40),
				allowNull: false
			},
			modelo: {
				type: Sequelize.STRING(60),
				allowNull: false
			},
			cor: {
				type: Sequelize.STRING(40),
				allowNull: false
			},
			placa: {
				type: Sequelize.STRING(7),
				allowNull: false
			},
			localizacao: {
				type: Sequelize.STRING(40),
				allowNull: false
			},
			preco: {
				type: Sequelize.DECIMAL(17,2),
				allowNull: false
			},
			preco_fipe: {
				type: Sequelize.DECIMAL(17,2),
				allowNull: false
			},
			quilometragem: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			ano_modelo: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			ano_fabricacao: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			nro_portas: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			situacao: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1
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
		return queryInterface.dropTable('announcements');
	}
};
