import { stripIndents } from "common-tags";
import {
	__pokemonColors__,
	__pokemonStats__,
	__pokemonTypes__
} from "../../lib/constants";
import Command from "../command";

export default new Command({
	options: {
		name: "info",
		description: "Get info on a pokémon",
		options: [
			{
				name: "pokémon",
				description: "The name of the pokémon",
				type: 3,
				required: true
			}
		]
	},
	exec: async ({ bot, interaction }) => {
		const name = interaction.options.getString("pokémon", true);

		const pokemon = await bot.dex.getPokemonByName(name).catch(() => {});
		if (!pokemon)
			return bot.util.formatError(`Unable to find pokémon \`${name}\``);

		const species = await bot.dex.getPokemonSpeciesByName(name).catch(() => {});
		if (!species)
			return bot.util.formatError(`Unable to find pokémon species \`${name}\``);

		const femaleRate = (species.gender_rate / 8) * 100;

		const url = species.evolution_chain.url.split("/");
		const chain = await bot.dex
			.getEvolutionChainById(parseInt(url[url.length - 2]))
			.catch(() => {});
		if (!chain)
			return bot.util.formatError(
				`Unable to find evolution chain of \`${name}\``
			);

		let prev: string[] = [];
		let next: string[] = [];
		let evolution = chain.chain;
		let hasEvolved = false;

		while (evolution) {
			if (evolution.species.name === pokemon.name) {
				hasEvolved = true;

				evolution = evolution.evolves_to[0];
				continue;
			}
			if (!hasEvolved) {
				prev.push(evolution.species.name);

				evolution = evolution.evolves_to[0];
				continue;
			}

			next.push(evolution.species.name);
			evolution = evolution.evolves_to[0];
		}

		return {
			embeds: [
				bot.util.formatEmbed(
					{
						title: `🔎 Info | #${pokemon.id} - ${bot.util.capitalize(
							pokemon.name,
							"-"
						)}`,
						fields: [
							{
								name: "Base Stats",
								value: pokemon.stats
									.map(
										(stat) =>
											`**${__pokemonStats__[stat.stat.name]}:** ${
												stat.base_stat
											}`
									)
									.join("\n"),
								inline: true
							},
							{
								name: "Description",
								value: stripIndents`
								**Height:** ${pokemon.height / 10} m
								**Weight:** ${pokemon.weight / 10} kg
								**Color:** ${bot.util.capitalize(species.color.name, "-")}
								`,
								inline: true
							},
							{
								name: "Evolutions",
								value: `${
									prev.length
										? stripIndents`**Previous:**
										${prev.map((name) => `❯ ${bot.util.capitalize(name, "-")}`).join("\n")}
										`
										: ""
								}${
									next.length
										? `${prev.length ? "\n" : ""}**Next:**\n${next
												.map((name) => `❯ ${bot.util.capitalize(name, "-")}`)
												.join("\n")}`
										: ""
								}${prev.length || next.length ? "" : "None"}`,
								inline: true
							},
							{
								name: `Type${pokemon.types.length === 1 ? "" : "s"}`,
								value: pokemon.types
									.map(
										(type) =>
											`❯ ${bot.util.capitalize(type.type.name, "-")} ${
												__pokemonTypes__[type.type.name]
											}`
									)
									.join("\n"),
								inline: true
							},
							{
								name: `Abilit${pokemon.abilities.length === 1 ? "y" : "ies"}`,
								value: `${pokemon.abilities
									.filter((ability) => !ability.is_hidden)
									.map(
										(ability) =>
											`❯ ${bot.util.capitalize(ability.ability.name, "-")}`
									)
									.join("\n")}${
									pokemon.abilities.some((ability) => ability.is_hidden)
										? `\n❯ (${bot.util.capitalize(
												pokemon.abilities.filter(
													(ability) => ability.is_hidden
												)[0].ability.name,
												"-"
										  )})`
										: ""
								}`,
								inline: true
							},
							{
								name: "Gender",
								value:
									species.gender_rate === -1
										? "Genderless"
										: stripIndents`
										**Male:** ${100 - femaleRate}%
										**Female:** ${femaleRate}%
										`,
								inline: true
							}
						],
						image: { url: bot.util.getPokemonImage(pokemon.id) },
						color: __pokemonColors__[species.color.name]
					},
					interaction
				)
			]
		};
	},
	props: {
		category: "Pokémon"
	}
});
