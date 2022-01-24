import crypto from 'crypto';
import environmentConfig from '../../config/environment';
import fileManagementConfig from '../../config/filemanagement';
import fs from 'fs';
import * as Yup from 'yup';

import Announcement from '../models/Announcement';
import AnnouncementComponent from '../models/AnnouncementComponent';
import AnnouncementImage from '../models/AnnouncementImage';

class AnnouncementController {
	constructor() {
		this.errors = [];
		this.imagesPath = fileManagementConfig.public.path;
		this.imagesSymbolicPath = environmentConfig.url + '/files';
	}

	async store(req, res) {
		const that = this;
		await this.validateStore(req.body);

		if (this.errors.length) {
			return res.status(400).json(this.getValidationErrors());
		}

		const {
			id, marca, modelo, cor, placa, localizacao, preco, preco_fipe,
			quilometragem, ano_modelo, ano_fabricacao,  nro_portas, situacao
		} = await Announcement.create(req.body);

		return res.json({
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
		});
	}

	async update(req, res) {
		await this.validateUpdate(req.body);

		const { id } = req.params;
		const announcement = await Announcement.findByPk(id);
		if (!announcement) {
			await this.setValidationError({'error': 'ValidationError', 'message': 'Announcement not exists'});
		}

		if (this.errors.length) {
			return res.status(400).json(this.getValidationErrors());
		}

		const {
			marca, modelo, cor, placa, localizacao, preco, preco_fipe,
			quilometragem, ano_modelo, ano_fabricacao,  nro_portas, situacao
		} = await announcement.update(req.body);

		return res.json({
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
		});
	}

	async getById(req, res) {
		const { id } = req.params;
		if (!id) {
			await this.setValidationError({'error': 'ValidationError', 'message': 'Announcement not exists'});
		}

		if (this.errors.length) {
			return res.status(400).json(this.getValidationErrors());
		}

		var response = {
			...await Announcement.findByPk(id, {raw: true}),
			'images': await this.getAnnouncementImages(id)
		}

		return res.json(response);
	}

	async getAnnouncementImages(id) {
		const files = await AnnouncementImage.findAll({
			where: {
				id_announcement: id
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

	async getAllForListing(req, res) {
		const response = await Announcement.findAll({
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
			]
		});

		return res.json(response);
	}

	async deleteMass(req, res) { //TODO: CRIAR CAMADA DE SERVICO PARA MELHOR ORGANIZAÇAO E REAPROVEITAMENTO DE CODIGO
		const { ids } = req.body;

		if (ids && ids.length) {
			for (let i = 0; i < ids.length; i++) {
				const announcement = await Announcement.findByPk(ids[i]);
				if (!announcement) {
					await this.setValidationError({'error': 'ValidationError', 'message': 'Announcement not exists'});
				}

				if (this.errors.length) {
					return res.status(400).json(this.getValidationErrors());
				}

				await announcement.destroy();
			}
		}

		return res.json({
			'ids': ids,
			'message': 'Announcements deleted successfully'
		});
	}

	async delete(req, res) {
		const { id } = req.params;

		if (!id) {
			await this.setValidationError({'error': 'ValidationError', 'message': 'ID is a required field'});
		}

		const announcement = await Announcement.findByPk(id);
		if (!announcement) {
			await this.setValidationError({'error': 'ValidationError', 'message': 'Announcement not exists'});
		}

		if (this.errors.length) {
			return res.status(400).json(this.getValidationErrors());
		}

		const announcementImages = AnnouncementImage.findAll({
			where: {
				id_announcement: id
			},
			attributes: ['id'],
			raw: true
		});

		await announcement.destroy();

		return res.json({
			'id': id,
			'message': 'Announcement deleted successfully'
		});
	}

	async storeFiles(req, res) {
		const that = this;
		var response = [];

		if (req.files) {
			const files = req.files.files.length ? req.files.files : [req.files.files];
			const { announcementId } = req.params;

			for (let i = 0; i < files.length; i++) {
				var file = await that.writeFile(files[i], announcementId);
				response.push(file);
			}
		}

		return res.json({
			'uploadedImages': response
		});
	}

	async deleteFilesByIds(req, res) {
		const that = this;
		const { ids } = req.body;
		var response = [];

		if (!ids) {
			await this.setValidationError({'error': 'ValidationError', 'message': 'IDS is a required field'});
		}

		if (this.errors.length) {
			return res.status(400).json(this.getValidationErrors());
		}

		const filesToDelete = await AnnouncementImage.findAll({
			where: {
				id: ids
			},
			raw: true
		});

		if (filesToDelete.length) {
			for (let i = 0; i < filesToDelete.length; i++) {
				var fileId = await that.deleteFile(filesToDelete[i]);
				response.push(fileId);
			}
		}

		return res.json({
			'deletedImages': response
		});
	}

	async writeFile(file, announcementId) {
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

	async deleteFile(objFile) {
		const that = this;
		const path = that.imagesPath + '/' + objFile.name;

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

	async validateStore(data) {
		await this.validateStoreFields(data);
	}

	async validateUpdate(data) {
		await this.validateUpdateFields(data);
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
			that.setValidationError({'error': error.name, 'message': error.errors});
		});
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
			that.setValidationError({'error': error.name, 'message': error.errors});
		});
	}

	setValidationError(error) {
		this.errors.push(error)
	}

	getValidationErrors() {
		var response = this.errors;
		this.errors = [];

		return response;
	}
}

export default new AnnouncementController();