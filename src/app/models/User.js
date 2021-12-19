import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
	static init(sequelize) {
		super.init(
			{
				name: Sequelize.STRING,
				email: Sequelize.STRING,
				password: Sequelize.VIRTUAL,
				password_hash: Sequelize.STRING,
			},
			{
				sequelize
			}
		);

		this.addHook('beforeSave', this.beforeSaveUser);

		return this;
	}

	checkPassword(password) {
		return bcrypt.compare(password, this.password_hash);
	}

	static async beforeSaveUser(user) {
		await this.encryptPassword(user);
	}

	static async encryptPassword(user) {
		if (user.password) {
			user.password_hash = await bcrypt.hash(user.password, 8);
		}
	}
}

export default User;