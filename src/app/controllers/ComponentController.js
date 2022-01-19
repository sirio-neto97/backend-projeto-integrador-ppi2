import Component from '../models/Component';
import * as Yup from 'yup';

class ComponentController {
	constructor() {
		this.errors = [];
	}

	async store(req, res) {
		await this.validateStore(req.body);

		if (this.errors.length) {
			return res.status(400).json(this.getValidationErrors());
		}

		const { id, name } = await Component.create(req.body);

		return res.json({
			id,
			name
		});
	}

	async update(req, res) {
		await this.validateUpdate(req.body);

		const { id } = req.params;
		const component = await Component.findByPk(id);
		if (!component) {
			await this.setValidationError({'error': 'ValidationError', 'message': 'Component not exists'});
		}

		if (this.errors.length) {
			return res.status(400).json(this.getValidationErrors());
		}

		const { name } = await component.update(req.body);

		return res.json({
			id,
			name
		});
	}

	async getAllForListing(req, res) {
		const response = await Component.findAll({
			order: [
				['name', 'ASC']
			],
			attributes: [
				'id',
				'name'
			]
		});

		return res.json(response);
	}

	async delete(req, res) {
		const { id } = req.params;

		if (!id) {
			await this.setValidationError({'error': 'ValidationError', 'message': 'ID is a required field'});
		}

		const component = await Component.findByPk(id);
		if (!component) {
			await this.setValidationError({'error': 'ValidationError', 'message': 'component not exists'});
		}

		if (this.errors.length) {
			return res.status(400).json(this.getValidationErrors());
		}

		await component.destroy();

		return res.json({
			'id': id,
			'message': 'Component deleted successfully'
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
			'name': Yup.string().required(),
		});

		await schema.validate(data).catch(function(error) {
			that.setValidationError({'error': error.name, 'message': error.errors});
		});
	}

	async validateUpdateFields(data) {
		const that = this;
		const schema = Yup.object().shape({
			'name': Yup.string()
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

export default new ComponentController();