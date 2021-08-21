import {
	CommandInteraction,
	GuildMember,
	InteractionReplyOptions,
	MessageEmbedOptions
} from "discord.js";

export default class Util {
	public formatEmbed(
		embed: MessageEmbedOptions,
		interaction: CommandInteraction
	) {
		if (embed.color === undefined) embed.color = 0x7289da;
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

	public joinParts(parts: string[]) {
		const last = parts.pop();
		if (!parts.length) return last;
		if (parts.length === 1) return `${parts[0]} and ${last}`;

		return `${parts.join(", ")}, and ${last}`;
	}

	public parseTime(ms: number) {
		let time: Record<string, number> = {};
		let s = ms / 1000;

		time.h = Math.floor(s / 3600);
		s %= 3600;

		time.m = Math.floor(s / 60);
		s %= 60;

		time.s = time.h && time.m ? Math.round(s) : Math.round(s * 10) / 10;

		return `\`${this.joinParts(
			Object.keys(time)
				.filter((key) => time[key] !== 0)
				.map((key) => `${time[key]}${key}`)
		)}\``;
	}
}
