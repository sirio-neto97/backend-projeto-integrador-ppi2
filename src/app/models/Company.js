import Sequelize, { Model } from 'sequelize';

class Company extends Model {
	static init(sequelize) {
		super.init(
			{
				nome: Sequelize.STRING,
				cnpj: Sequelize.STRING,
				sobre: Sequelize.STRING,
				localizacao: Sequelize.STRING,
				email: Sequelize.STRING,
				telefone: Sequelize.STRING,
				whatsapp: Sequelize.STRING,
				instagram: Sequelize.STRING,
				facebook: Sequelize.STRING,
			},
			{
				sequelize
			}
		);

		return this;
	}
}

export default Company;