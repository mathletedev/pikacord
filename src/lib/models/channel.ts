import { getModelForClass, prop as Property } from "@typegoose/typegoose";

export class Channel {
	@Property({ required: true, unique: true })
	public channelId: string;

	@Property({
		required: true,
		default: () => Math.floor(Math.random() * 40) + 10
	})
	public nextSpawn: number;

	@Property()
	public pokemon: string;
}

export const ChannelModel = getModelForClass(Channel);
