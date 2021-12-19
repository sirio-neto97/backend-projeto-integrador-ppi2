import Sequelize, { Model } from 'sequelize';

class AnnouncementComponent extends Model {
	static init(sequelize) {
		super.init(
			{
				id_announcement: Sequelize.INTEGER,
				id_component: Sequelize.INTEGER,
			},
			{
				sequelize
			}
		);

		return this;
	}
}

export default AnnouncementComponent;