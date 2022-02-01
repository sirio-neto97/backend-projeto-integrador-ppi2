export default class ServiceBase {
	constructor() {
		this.errors = [];
	}

	hasErrors() {
		return this.errors.length > 0;
	}

	setError(error) {
		this.errors.push(error)
	}

	clearErrors() {
		this.errors = [];
	}

	getErrors() {
		const response = this.errors;
		this.clearErrors();

		return response;
	}
}