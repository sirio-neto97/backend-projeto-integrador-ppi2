import Sequelize, { Model } from 'sequelize';

class Announcement extends Model {
	static init(sequelize) {
		super.init(
			{
				marca: Sequelize.STRING,
				modelo: Sequelize.STRING,
				cor: Sequelize.STRING,
				placa: Sequelize.STRING,
				localizacao: Sequelize.STRING,
				preco: Sequelize.DECIMAL,
				preco_fipe: Sequelize.DECIMAL,
				quilometragem: Sequelize.INTEGER,
				ano_modelo: Sequelize.INTEGER,
				ano_fabricacao: Sequelize.INTEGER,
				nro_portas: Sequelize.INTEGER,
				situacao: Sequelize.INTEGER
			},
			{
				sequelize
			}
		);

		return this;
	}
}

export default Announcement;