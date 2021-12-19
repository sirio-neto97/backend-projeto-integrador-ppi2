import Sequelize from  'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import Announcement from '../app/models/Announcement';
import AnnouncementComponent from '../app/models/AnnouncementComponent';
import Component from '../app/models/Component';
import Company from '../app/models/Company';

const models = [User, Announcement, AnnouncementComponent, Component, Company];

class Database {
	constructor() {
		this.init();
	}

	init() {
		this.connection = new Sequelize(databaseConfig);

		models.map(model => {
			model.init(this.connection);
		});
	}
}

export default new Database();