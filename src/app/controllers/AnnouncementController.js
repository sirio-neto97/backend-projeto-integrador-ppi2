import Announcement from '../models/Announcement';
import * as Yup from 'yup';

class AnnouncementController {
	constructor() {
		this.errors = [];
	}

	async store(req, res) {
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

		const response = await Announcement.findByPk(id);

		return res.json(response);
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

		await announcement.destroy();

		return res.json({
			'id': id,
			'message': 'Announcement deleted successfully'
		});
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
		return this.errors;
	}
}

export default new AnnouncementController();