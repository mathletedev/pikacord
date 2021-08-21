import { TextChannel } from "discord.js";
import Command from "../command";

export default new Command({
	options: {
		name: "purge",
		description: "Deletes messages from a channel",
		options: [
			{
				name: "amount",
				description: "Number of messages to delete",
				type: 4,
				required: true
			}
		]
	},
	exec: async ({ bot, interaction }) => {
		const amount = interaction.options.getInteger("amount", true);
		if (amount < 1 || amount > 1000)
			return bot.util.formatError("Amount must be between **1** and **100**");

		const channel = bot.client.channels.cache.get(interaction.channelId);
		if (!channel) return bot.util.formatError("Unable to find channel");

		try {
			const deleted = await (channel as TextChannel).bulkDelete(amount);

			return {
				content: `🗑️ Deleted ${deleted.size} message${
					deleted.size === 1 ? "" : "s"
				}`,
				ephemeral: true
			};
		} catch (_) {
			return bot.util.formatError("Cannot delete messages over 14 days old");
		}
	},
	props: {
		category: "Utilities"
	}
});
