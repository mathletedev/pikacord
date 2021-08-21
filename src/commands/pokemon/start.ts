import Command from "../command";

export default new Command({
	options: {
		name: "start",
		description: "Create a Pikacord account"
	},
	exec: async ({ bot, interaction }) => {
		const user = await bot.db.createUser(interaction.user.id);
		if (!user)
			return bot.util.formatError("You already have a Pikacord account");

		return "Successfully created a Pikacord account! Use `/help` for more info";
	},
	props: {
		category: "Pokémon"
	}
});
