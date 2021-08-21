import { __defaultError__ } from "../../lib/constants";
import Command from "../command";

export default new Command({
	options: {
		name: "bal",
		description: "Check your balance"
	},
	exec: async ({ bot, interaction }) => {
		const user = await bot.db.getUser(interaction.user.id);
		if (!user) return __defaultError__;

		return {
			embeds: [
				bot.util.formatEmbed(
					{
						title: "👛 Balance",
						description: `You have **${user.balance}** pikacoins!`
					},
					interaction
				)
			]
		};
	},
	props: {
		category: "Currency",
		needsAccount: true
	}
});
