import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types";
import {
	CommandInteraction,
	InteractionReplyOptions,
	MessagePayload
} from "discord.js";
import Bot from "../bot";
import { __defaultError__ } from "../lib/constants";

export interface CommandProps {
	category: string;
	cooldown?: number;
	needsAccount?: boolean;
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

	public constructor({
		options,
		exec,
		props
	}: {
		options: RESTPostAPIApplicationCommandsJSONBody;
		exec: CommandExecute;
		props: CommandProps;
	}) {
		this.options = options;
		this.props = props;
		this._exec = exec;
	}

	public async exec({ bot, interaction }: CommandArgs) {
		if (this.props.needsAccount) {
			const user = await bot.db.getUser(interaction.user.id);
			if (!user)
				return interaction.reply(
					bot.util.formatError(
						"This command requires you to have a Pikacord account. Use `/start` to create one!"
					)
				);
		}

		if (this.props.cooldown) {
			const cooldown = await bot.db.getCooldown(
				this.options.name,
				interaction.user.id
			);
			if (cooldown && Date.now() < cooldown.createdAt + this.props.cooldown)
				return interaction.reply({
					content: `⏳ Please wait ${bot.util.parseTime(
						cooldown.createdAt + this.props.cooldown - Date.now()
					)} before using this command again`,
					ephemeral: true
				});

			bot.db.resetCooldown(this.options.name, interaction.user.id);
		}

		try {
			const res = await this._exec({ bot, interaction });
			if (!res) return;

			interaction.reply(res);
		} catch (error) {
			interaction.reply(__defaultError__);

			bot.logger.error((error as Error).message);
		}
	}
}
