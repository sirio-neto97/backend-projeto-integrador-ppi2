import User from '../models/User';
import * as Yup from 'yup';

class UserController {
	async store(req, res) {
		await UserController.validateStore(req.body);

		if (UserController.errors) {
			return res.status(400).json(UserController.getValidationErrors());
		}

		const { id, name, email, provider } = await User.create(req.body);

		return res.json({
			id,
			name,
			email,
			provider
		});
	}

	async update(req, res) {
		const { email } = req.body;
		const user = await User.findByPk(req.userId);

		await UserController.validateUpdate(req.body, user);

		if (email !== user.email) {
			await UserController.validateEmailExists(req.body);
		}

		if (UserController.errors) {
			return res.status(400).json(UserController.getValidationErrors());
		}

		const { id, name } = await user.update(req.body);

		return res.json({
			id,
			name,
			email,
		});
	}

	static async validateStore(data) {
		await this.validateStoreFields(data);
		await this.validateEmailExists(data);
	}

	static async validateUpdate(data, user) {
		await this.validateUpdateFields(data);
		await this.validateOldPassword(data, user);
	}

	static async validateStoreFields(data) {
		const schema = Yup.object().shape({
			'name': Yup.string().required(),
			'email': Yup.string().email().required(),
			'password': Yup.string().required().min(6)
		});

		if (!(await schema.isValid(data))) {
			await this.setValidationError({'msg': 'Invalid fields'});
		}
	}

	static async validateUpdateFields(data) {
		const schema = Yup.object().shape({
			'name': Yup.string(),
			'email': Yup.string().email(),
			'oldPassword': Yup.string().min(6),
			'password': Yup.string().min(6).when('oldPassword', function(oldPassword, field) {
				return oldPassword ? field.required() : field;
			}),
			'confirmPassword': Yup.string().min(6).when('password', function(password, field) {
				return password ? field.required().oneOf([Yup.ref('password')]) : field;
			})
		});

		if (!(await schema.isValid(data))) {
			await this.setValidationError({'msg': 'Invalid fields'});
		}
	}

	static async validateOldPassword(data, user) {
		const { oldPassword } = data;
		if (oldPassword && !(await user.checkPassword(oldPassword))) {
			await this.setValidationError({'msg': 'Invalid password'})
		}
	}

	static async validateEmailExists(data) {
		const exists = await User.findOne({
			where: {email: data.email}
		});

		if (exists) {
			await this.setValidationError({'msg': 'Email already in use'});
		}
	}

	static setValidationError(error) {
		if (!this.errors) {
			this.errors = [];
		}

		this.errors.push(error)
	}

	static getValidationErrors() {
		return this.errors;
	}
}

export default new UserController();