import Sequelize, { Model } from 'sequelize';

class AnnouncementImage extends Model {
	static init(sequelize) {
		super.init(
			{
				id_announcement: Sequelize.INTEGER,
				name: Sequelize.STRING
			},
			{
				sequelize
			}
		);

		return this;
	}
}

export default AnnouncementImage;