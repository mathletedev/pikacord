export class Logger {
	private log(type: string, message: string) {
		const now = new Date();

		console.log(
			`[ ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} ] ${type} | ${message}`
		);
	}

	public info(message: string) {
		this.log("INFO", message);
	}

	public warn(message: string) {
		this.log("WARN", message);
	}

	public error(message: string) {
		this.log("ERROR", message);
	}
}
