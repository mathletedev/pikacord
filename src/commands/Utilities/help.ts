import { stripIndents } from "common-tags";
import { __categories__ } from "../../utils/constants";
import Command from "../command";

export default new Command({
	options: {
		name: "help",
		description: "See info on commands",
		options: [
			{
				name: "command",
				description: "The command you want info on",
				type: 3
			}
		]
	},
	exec: async ({ bot, interaction }) => {
		const commandName = interaction.options.getString("command", false);

		if (commandName) {
			const command = bot.commands.find(
				(command) => command.options.name === commandName
			);
			if (!command)
				return bot.util.formatError(
					`Command \`${commandName}\` does not exist`
				);

			return {
				embeds: [
					bot.util.formatEmbed(
						{
							title: `📓 Help | /${command.options.name}`,
							description: stripIndents`
						❯ **Description:** ${command.options.description}
						❯ **Category:** ${__categories__[command.props.category]} ${
								command.props.category
							}
						❯ **Usage:** \`/${command.options.name}${
								command.options.options
									? command.options.options.map(
											(option) =>
												` ${option.required ? "<" : "["}${option.name}${
													option.required ? ">" : "]"
												}`
									  )
									: ""
							}\`
						`
						},
						interaction
					)
				]
			};
		}

		return {
			embeds: [
				bot.util.formatEmbed(
					{
						title: "📓 Help",
						fields: Object.keys(__categories__).map((category) => ({
							name: `${__categories__[category]} ${category}`,
							value: bot.commands
								.filter((command) => command.props.category === category)
								.map((command) => `\`${command.options.name}\``)
								.join("\n"),
							inline: true
						}))
					},
					interaction
				)
			]
		};
	},
	props: {
		category: "Utilities"
	}
});
