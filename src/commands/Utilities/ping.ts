import { stripIndents } from "common-tags";
import { Message } from "discord.js";
import Command from "../command";

export default new Command({
	options: {
		name: "ping",
		description: "Check the latency of the server"
	},
	exec: async ({ bot, interaction }) => {
		const sent = (await interaction.fetchReply()) as Message;

		interaction.editReply({
			embeds: [
				bot.util.formatEmbed(
					{
						title: "🏓 Pong!",
						description: stripIndents`
						⌛ ${sent.createdTimestamp - interaction.createdTimestamp} ms
						
						💓 ${Math.round(bot.client.ws.ping)} ms`
					},
					interaction
				)
			]
		});
	},
	props: { category: "Utilities" }
});
