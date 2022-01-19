import Company from '../models/Company';
import * as Yup from 'yup';

class MessageController {
	async send(req, res) {
		const { type } = req.body;

		await MessageController.validateSend(req.body);

		if (MessageController.errors) {
			return res.status(400).json(MessageController.getValidationErrors());
		}

		if (type === MessageController.getMessageTypes()[0]) {
			const response = await this.sendWhatsAppMessage(req.body);

			if (response.error) {
				return res.status(400).json({'error': 'ValidationError','message': response.error});
			}

			return res.json({
				'error': false,
				'url': response
			});
		}
	}

	async sendWhatsAppMessage(data) {
		const companyData = await Company.findOne({attributes: ['whatsapp']});
		if (!companyData || !companyData.whatsapp) {
			return {error: 'Ainda não há um WhatsApp para contato configurado pelo administrador'};
		}

		const { message } = data;
		const baseUrl = 'https://api.whatsapp.com/send/?phone='

		return baseUrl + companyData.whatsapp + '&text=' + message;
	}

	static async validateSend(data) {
		await this.validateSendFields(data);
	}

	static async validateSendFields(data) {
		const that = this;
		const schema = Yup.object().shape({
			'message': Yup.string().required(),
			'type': Yup.string().required().oneOf(that.getMessageTypes())
		});

		await schema.validate(data).catch(function(error) {
			that.setValidationError({'error': error.name, 'message': error.errors});
		});
	}

	static setValidationError(error) {
		if (!this.errors) {
			this.errors = [];
		}

		this.errors.push(error)
	}

	static getValidationErrors() {
		var response = this.errors;
		this.errors = [];

		return response;
	}

	static getMessageTypes() {
		return ['whatsApp'];
	}
}

export default new MessageController();