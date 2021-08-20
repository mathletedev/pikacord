import { Message } from "discord.js";
import Command from "../command";

export default new Command(
	{
		name: "ping",
		description: "Check the latency of the server"
	},
	async ({ bot, interaction }) => {
		await interaction.reply("Ping?");
		const sent = (await interaction.fetchReply()) as Message;

		interaction.editReply({
			embeds: [
				bot.util.formatEmbed(
					{
						title: "🏓 Pong!",
						description: `⌛ ${
							sent.createdTimestamp - interaction.createdTimestamp
						} ms\n\n💓 ${Math.round(bot.client.ws.ping)} ms`
					},
					interaction
				)
			]
		});
	}
);
