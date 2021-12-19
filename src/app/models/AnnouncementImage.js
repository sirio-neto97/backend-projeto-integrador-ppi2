import Sequelize, { Model } from 'sequelize';

class AnnouncementImage extends Model {
	static init(sequelize) {
		super.init(
			{
				id_annoucement: Sequelize.INTEGER,
				path: Sequelize.STRING
			},
			{
				sequelize
			}
		);

		return this;
	}
}

export default AnnouncementImage;