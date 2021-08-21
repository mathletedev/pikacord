import { getModelForClass, prop as Property } from "@typegoose/typegoose";

export class Cooldown {
	@Property({ required: true })
	public command: string;

	@Property({ required: true })
	public userId: string;

	@Property({ required: true, default: () => Date.now() })
	public createdAt: number;
}

export const CooldownModel = getModelForClass(Cooldown);
