import Company from '../models/Company';
import * as Yup from 'yup';

class CompanyController {
	constructor() {
		this.errors = [];
	}

	async store(req, res) {
		await this.validateStore(req.body);

		if (this.errors.length) {
			return res.status(400).json(this.getValidationErrors());
		}

		const company = await Company.findOne();
		if (company) {
			company.destroy();
		}

		const {
			nome, cnpj, sobre, localizacao, email,
			telefone, whatsapp, instagram, facebook
		} = await Company.create(req.body);

		return res.json({
			nome,
			cnpj,
			sobre,
			localizacao,
			email,
			telefone,
			whatsapp,
			instagram,
			facebook
		});
	}

	async getAboutData(req, res) {
		const { sobre } = Company.findOne();

		return res.json({sobre});
	}

	async getContactData(req, res) {
		const {
			nome, cnpj, localizacao, email,
			telefone, whatsapp, instagram, facebook
		} = await Company.findOne();

		return res.json({
			nome,
			cnpj,
			localizacao,
			email,
			telefone,
			whatsapp,
			instagram,
			facebook
		});
	}

	async validateStore(data) {
		await this.validateStoreFields(data);
	}

	async validateStoreFields(data) {
		const that = this;
		const schema = Yup.object().shape({
			'nome': Yup.string().required(),
			'cnpj': Yup.string().max(18),
			'sobre': Yup.string().required(),
			'localizacao': Yup.string(),
			'email': Yup.string().email().required(),
			'telefone': Yup.string().required(),
			'whatsapp': Yup.string().required(),
			'instagram': Yup.string(),
			'facebook': Yup.string()
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

export default new CompanyController();