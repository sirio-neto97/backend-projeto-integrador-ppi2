import ServiceBase from './ServiceBase';

import crypto from 'crypto';
import environmentConfig from '../../config/environment';
import fileManagementConfig from '../../config/filemanagement';
import fs from 'fs';
import * as Yup from 'yup';

import Announcement from '../models/Announcement';
import AnnouncementComponent from '../models/AnnouncementComponent';
import AnnouncementImage from '../models/AnnouncementImage';

class AnnouncementService extends ServiceBase {
	constructor() {
		super();
		this.imagesPath = fileManagementConfig.public.path;
		this.imagesSymbolicPath = environmentConfig.url + '/files';
	}

	async store(data) {
		await this.validateStore(data);

		if (this.hasErrors()) {
			return [];
		}

		const {
			id, marca, modelo, cor, placa, localizacao, preco, preco_fipe,
			quilometragem, ano_modelo, ano_fabricacao,  nro_portas, situacao
		} = await Announcement.create(data);

		return {
			id,
			marca,
			modelo,
			cor,
			placa,
			localizacao,
			preco,
			preco_fipe,
			quilometragem,
			ano_modelo,
			ano_fabricacao,
			nro_portas,
			situacao
		};
	}

	async validateStore(data) {
		await this.validateStoreFields(data);
	}

	async validateStoreFields(data) {
		const that = this;
		const schema = Yup.object().shape({
			'marca': Yup.string().required(),
			'modelo': Yup.string().required(),
			'ano_modelo': Yup.number().required(),
			'ano_fabricacao': Yup.number().required(),
			'nro_portas': Yup.number().required(),
			'cor': Yup.string().required(),
			'quilometragem': Yup.number().required(),
			'preco_fipe': Yup.number().required(),
			'preco': Yup.number().required(),
			'placa': Yup.string().required().max(7),
			'localizacao': Yup.string().required(),
			'situacao': Yup.number().required(),
		});

		await schema.validate(data).catch(function(error) {
			that.setError({'error': error.name, 'message': error.errors});
		});
	}

	async update(data) {
		await this.validateUpdate(data);

		if (this.hasErrors()) {
			return [];
		}

		await Announcement.update(data, {
			where: {
				id: data.id
			}
		});

		return {
			id: data.id,
		};
	}

	async validateUpdate(data) {
		await this.validateExists(data);
		await this.validateUpdateFields(data);
	}

	async validateExists(data) {
		const announcement = await Announcement.findByPk(data.id);

		if (!announcement) {
			await this.setError({'error': 'ValidationError', 'message': 'Announcement not exists'});
		}
	}

	async validateUpdateFields(data) {
		const that = this;
		const schema = Yup.object().shape({
			'marca': Yup.string(),
			'modelo': Yup.string(),
			'ano_modelo': Yup.number(),
			'ano_fabricacao': Yup.number(),
			'nro_portas': Yup.number(),
			'cor': Yup.string(),
			'quilometragem': Yup.number(),
			'preco_fipe': Yup.number(),
			'preco': Yup.number(),
			'placa': Yup.string().max(7),
			'localizacao': Yup.string(),
			'situacao': Yup.number()
		});

		await schema.validate(data).catch(function(error) {
			that.setError({'error': error.name, 'message': error.errors});
		});
	}

	async delete(announcementId) {
		if (!announcementId) {
			await this.setError({'error': 'ValidationError', 'message': 'ID is a required field'});
		}

		const announcement = await Announcement.findByPk(announcementId);
		if (!announcement) {
			await this.setError({'error': 'ValidationError', 'message': 'Announcement not exists'});
		}

		if (this.hasErrors()) {
			return [];
		}

		const announcementImages = await AnnouncementImage.findAll({
			where: {
				id_announcement: announcementId
			},
			attributes: ['id'],
			raw: true
		});

		var deletedImages = [];
		if (announcementImages.length) {
			var ids = [];
			announcementImages.forEach(function(image) {
				return ids.push(image.id);
			});

			deletedImages = await this.deleteFilesByIds(ids);
		}


		await announcement.destroy();

		return {
			'id': announcementId,
			'deletedImages': deletedImages,
			'message': 'Announcement deleted successfully'
		};
	}

	async deleteMass(ids) {
		ids = ids ?? [];

		for (let i = 0; i < ids.length; i++) {
			await this.delete(ids[i]);
		}

		return {
			'message': 'Announcements deleted successfully'
		};
	}

	async getById(announcementId) {
		announcementId = parseInt(announcementId);

		const announcement = await Announcement.findByPk(announcementId, {raw: true});
		if (!announcement) {
			await this.setError({'error': 'ValidationError', 'message': 'Announcement not exists'});
		}

		if (this.hasErrors()) {
			return [];
		}

		return {
			...announcement,
			'images': await this.getAnnouncementImages(announcementId)
		}
	}

	async getAnnouncementImages(announcementId) {
		const files = await AnnouncementImage.findAll({
			where: {
				id_announcement: announcementId
			},
			attributes: ['id', 'name'],
			raw: true
		});

		if (files) {
			for (let i = 0; i < files.length; i++) {
				files[i].path = this.imagesSymbolicPath + '/' + files[i].name;
			}
		}

		return files;
	}

	async getImageForListing(announcementId) {
		var path = this.imagesSymbolicPath + '/default.jpg';

		const file = await AnnouncementImage.findOne({
			where: {
				id_announcement: announcementId
			},
			attributes: ['id', 'name'],
			raw: true
		});

		if (file) {
			path = this.imagesSymbolicPath + '/' + file.name;
		}

		return path;
	}

	async storeFiles(id, aFiles) {
		var response = [];
		for (let i = 0; i < aFiles.length; i++) {
			var file = await this.storeFile(id, aFiles[i]);
			response.push(file);
		}

		return response;
	}

	async storeFile(announcementId, file) {
		const fileName = crypto.randomBytes(10).toString('hex') + file.name;
		const path = this.imagesPath + '/' + fileName;

		await fs.writeFile(path, file.data, function(error) {
			if (error) {
				return Response.status(500).json(error);
			}
		});

		const { id } = await AnnouncementImage.create({
			'id_announcement': announcementId,
			'name': fileName
		});

		return {'id': id, 'name': fileName};
	}

	async deleteFilesByIds(ids) {
		ids = ids || [];
		var response = [];

		if (!ids.length) {
			await this.setError({'error': 'ValidationError', 'message': 'IDS is a required field'});
		}

		if (this.hasErrors()) {
			return [];
		}

		const filesToDelete = await AnnouncementImage.findAll({
			where: {
				id: ids
			},
			raw: true
		});

		if (filesToDelete.length) {
			for (let i = 0; i < filesToDelete.length; i++) {
				var fileId = await this.deleteFile(filesToDelete[i]);
				response.push(fileId);
			}
		}

		return {
			'deletedImages': response
		};
	}

	async deleteFile(objFile) {
		const path = this.imagesPath + '/' + objFile.name;

		await fs.unlink(path, function(error) {
			if (error) {
				return error;
			}
		});

		await AnnouncementImage.destroy({
			where: {
				id: objFile.id
			}
		});

		return objFile.id;
	}

	async getAllForListing() {
		const announcements =  await Announcement.findAll({
			order: [
				['id', 'DESC']
			],
			attributes: [
				'id',
				'marca',
				'modelo',
				'cor',
				'placa',
				'localizacao',
				'preco',
				'preco_fipe',
				'quilometragem',
				'ano_modelo',
				'ano_fabricacao',
				'nro_portas',
				'situacao'
			],
			raw: true
		});

		for (let i = 0; i < announcements.length; i++) {
			announcements[i]['imagePath'] = await this.getImageForListing(announcements[i]['id']);
		}

		return announcements;
	}
}

export default new AnnouncementService();