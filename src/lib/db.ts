import { connect } from "mongoose";
import { CooldownModel } from "./models/cooldown";
import { UserModel } from "./models/user";

export default class DB {
	public constructor(mongoUri: string) {
		connect(mongoUri, {
			dbName: "pikacord",
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	}

	public async getUser(userId: string) {
		return await UserModel.findOne({ userId });
	}

	public async createUser(userId: string) {
		if (await this.getUser(userId)) return;

		const user = new UserModel({ userId });
		return await user.save();
	}

	public async getCooldown(command: string, userId: string) {
		return await CooldownModel.findOne({ command, userId });
	}

	public async resetCooldown(command: string, userId: string) {
		const cooldown = await CooldownModel.findOne({ command, userId });

		if (!cooldown) {
			const newCooldown = new CooldownModel({ command, userId });
			return await newCooldown.save();
		}

		cooldown.createdAt = Date.now();
		return await cooldown.save();
	}

	public async addBalance(userId: string, amount: number) {
		const user = await this.getUser(userId);
		if (!user) return;

		user.balance += amount;
		return await user.save();
	}
}
