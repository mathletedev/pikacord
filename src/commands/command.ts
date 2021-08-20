import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types";
import {
	CommandInteraction,
	InteractionReplyOptions,
	MessagePayload
} from "discord.js";
import Bot from "../bot";

export interface CommandProps {
	cooldown: number;
}

export interface CommandArgs {
	bot: Bot;
	interaction: CommandInteraction;
}

type CommandExecute = (
	args: CommandArgs
) => Promise<string | InteractionReplyOptions | MessagePayload | void>;

export default class Command {
	public options: RESTPostAPIApplicationCommandsJSONBody;
	public props: CommandProps;
	private _exec: CommandExecute;

	public constructor(
		options: RESTPostAPIApplicationCommandsJSONBody,
		exec: CommandExecute,
		props: CommandProps = { cooldown: 0 }
	) {
		this.options = options;
		this.props = props;
		this._exec = exec;
	}

	public async exec({ bot, interaction }: CommandArgs) {
		try {
			const res = await this._exec({ bot, interaction });
			if (!res) return;

			interaction.reply(res);
		} catch (error) {
			bot.logger.error((error as Error).message);
		}
	}
}
