import Sequelize, { Model } from 'sequelize';

class Component extends Model {
	static init(sequelize) {
		super.init(
			{
				name: Sequelize.STRING,
			},
			{
				sequelize
			}
		);

		return this;
	}
}

export default Component;