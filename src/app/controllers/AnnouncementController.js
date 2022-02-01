import crypto from 'crypto';
import environmentConfig from '../../config/environment';
import fileManagementConfig from '../../config/filemanagement';
import fs from 'fs';
import * as Yup from 'yup';

import Announcement from '../models/Announcement';
import AnnouncementComponent from '../models/AnnouncementComponent';
import AnnouncementImage from '../models/AnnouncementImage';
import AnnouncementService from '../services/AnnouncementService';

class AnnouncementController {
	constructor() {
		this.errors = [];
		this.service = AnnouncementService;
		this.imagesPath = fileManagementConfig.public.path;
		this.imagesSymbolicPath = environmentConfig.url + '/files';
	}

	async store(req, res) {
		const response = await this.service.store(req.body);

		if (this.service.hasErrors()) {
			return res.status(400).json(this.service.getErrors());
		}

		return res.json(response);
	}

	async update(req, res) {
		const { id } = req.params;
		const data = {...req.body, id: id};

		const response = await this.service.update(data);

		if (this.service.hasErrors()) {
			return res.status(400).json(this.service.getErrors());
		}

		return res.json(response);
	}

	async getById(req, res) {
		const { id } = req.params;
		const response = await this.service.getById(id);

		if (this.service.hasErrors()) {
			return res.status(400).json(this.service.getErrors());
		}

		return res.json(response);
	}

	async getAllForListing(req, res) {
		const response = await this.service.getAllForListing();

		return res.json(response);
	}

	async deleteMass(req, res) {
		const { ids } = req.body;
		const response = await this.service.deleteMass(ids);

		if (this.service.hasErrors()) {
			return res.status(400).json(this.service.getErrors());
		}

		return res.json(response);
	}

	async delete(req, res) {
		const { id } = req.params;
		const response = await this.service.delete(id);

		if (this.service.hasErrors()) {
			return res.status(400).json(this.service.getErrors());
		}

		return res.json(response);
	}

	async storeFiles(req, res) {
		const { announcementId } = req.params;
		const formData = req.files;

		if (!formData || !announcementId) {
			return res;
		}

		const aFiles = formData.files.length ? formData.files : [formData.files];
		const response = await this.service.storeFiles(announcementId, aFiles);

		return res.json(response);
	}

	async deleteFilesByIds(req, res) {
		const { ids } = req.body;
		const response = this.service.deleteFilesByIds(ids);

		if (this.service.hasErrors()) {
			return res.status(400).json(this.service.getErrors());
		}

		return res.json(response);
	}
}

export default new AnnouncementController();