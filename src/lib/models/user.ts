import { getModelForClass, prop as Property } from "@typegoose/typegoose";

export class User {
	@Property({ required: true, unique: true })
	public userId: string;

	@Property({ required: true, default: 100 })
	public balance: number;
}

export const UserModel = getModelForClass(User);
