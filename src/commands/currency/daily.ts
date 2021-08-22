import { __defaultError__ } from "../../lib/constants";
import Command from "../command";

export default new Command({
	options: {
		name: "daily",
		description: "Get some pikacoins each day!"
	},
	exec: async ({ bot, interaction }) => {
		const amount = Math.floor(Math.random() * 150) + 100;

		const user = await bot.db.addBalance(interaction.user.id, amount);
		if (!user) return __defaultError__;

		return {
			embeds: [
				bot.util.formatEmbed(
					{
						title: "💸 Daily",
						description: `You received **${amount}** pikacoins!`
					},
					interaction
				)
			]
		};
	},
	props: {
		category: "Currency",
		cooldown: 8.64e7,
		needsAccount: true
	}
});
