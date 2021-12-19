import AnnouncementComponent from '../models/AnnouncementComponent';
import Announcement from '../models/Announcement';
import Component from '../models/Component';

// TODO: Rever necessidade dessa classe, por ser uma tabela relacional,
// que terá registro criado ao salvar o produto

// Seria interessante manter essa controller apenas para uma rota onde é
// possivel vincular componentes à vários veiculos (em massa)

class AnnouncementComponentController {
	constructor() {
		this.error = [];
	}

	async store(req, res) {
		await this.validateStore(req.body);

		if (this.errors.length) {
			return res.status(400).json(this.getValidationErrors());
		}

		const { id, id_announcement, id_component } = AnnouncementComponent.create(req.body);

		return res.json({
			id,
			id_announcement,
			id_component
		});
	}

	validateStore(data) {
		this.validateRelations(data);
	}

	validateUpdate(data) {
		this.validateRelations(data);
	}

	async validateRelations(data) {
		const { idAnnouncement, idComponent } = data;
		if (!(await Announcement.findByPk(idAnnouncement))) {
			await this.setValidationError({'error': 'ValidationError', 'message': 'Invalid idAnnouncement'});
		}

		if (!(await Component.findByPk(idComponent))) {
			await this.setValidationError({'error': 'ValidationError', 'message': 'Invalid idComponent'});
		}
	}

	setValidationError(error) {
		this.errors.push(error)
	}

	getValidationErrors() {
		return this.errors;
	}
}

export default new AnnouncementComponentController();