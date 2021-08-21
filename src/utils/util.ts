import {
	CommandInteraction,
	GuildMember,
	InteractionReplyOptions,
	MessageEmbedOptions
} from "discord.js";
import Bot from "../bot";

export class Util {
	private bot: Bot;

	public constructor(bot: Bot) {
		this.bot = bot;
	}

	public formatEmbed(
		embed: MessageEmbedOptions,
		interaction: CommandInteraction
	) {
		if (!embed.color) embed.color = 0x7289da;
		embed.footer = {
			iconURL: interaction.user.avatarURL() as string | undefined,
			text: `${
				(interaction.member as GuildMember).nickname ??
				interaction.user.username
			}${embed.footer?.text ? ` | ${embed.footer.text}` : ""}`
		};

		return embed;
	}

	public formatError(message: string): InteractionReplyOptions {
		return { content: `❌ ${message}`, ephemeral: true };
	}

	public capitalize(text: string, split: string = " ") {
		return text
			.split(split)
			.map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
			.join(" ");
	}
}
