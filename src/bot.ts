import { REST } from "@discordjs/rest";
import {
	RESTGetAPIApplicationCommandsResult,
	Routes
} from "discord-api-types/v9";
import { BitFieldResolvable, Client, Intents, IntentsString } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import Pokedex from "pokedex-promise-v2";
import Command from "./commands/command";
import { __colors__ } from "./lib/constants";
import DB from "./lib/db";
import Logger from "./lib/logger";
import Util from "./lib/util";

export default class Bot {
	public client: Client;
	private rest = new REST({ version: "9" });
	public commands: Command[] = [];
	public logger = new Logger();
	public util = new Util();
	public db: DB;
	public dex = new Pokedex();
	private token: string;

	public constructor(
		token: string,
		mongoUri: string,
		intents: BitFieldResolvable<IntentsString, number> = [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_MESSAGES
		]
	) {
		this.token = token;

		this.client = new Client({ intents });
		this.rest.setToken(token);
		this.db = new DB(mongoUri);
	}

	public async loadCommands(commandsDir: string) {
		for (const dir of readdirSync(join(__dirname, commandsDir))) {
			if (dir.endsWith(".js")) continue;

			for (const file of readdirSync(join(__dirname, commandsDir, dir))) {
				const command = (await import(`./${commandsDir}/${dir}/${file}`))
					.default;

				if (command instanceof Command) this.commands.push(command);
			}
		}
	}

	public async registerCommands(clientId: string, guildId?: string) {
		if (!this.commands.length)
			this.logger.warn(
				"Bot has not loaded any commands yet! Consider loading commands with `bot.loadCommands()`"
			);

		try {
			await this.rest.put(
				guildId
					? Routes.applicationGuildCommands(clientId, guildId)
					: Routes.applicationCommands(clientId),
				{ body: this.commands.map((command) => command.options) }
			);

			this.logger.info(
				`Successfully registered ${this.commands.length} commands!`
			);
		} catch (error) {
			this.logger.error((error as Error).message);
		}
	}

	public async unregisterCommands(clientId: string, guildId?: string) {
		try {
			const commands = (await this.rest.get(
				guildId
					? Routes.applicationGuildCommands(clientId, guildId)
					: Routes.applicationCommands(clientId)
			)) as RESTGetAPIApplicationCommandsResult;

			for (const command of commands) {
				if (guildId) {
					this.rest.delete(
						Routes.applicationGuildCommand(clientId, guildId, command.id)
					);
					continue;
				}

				this.rest.delete(Routes.applicationCommand(clientId, command.id));
			}

			this.logger.info(`Successfully unregistered all commands!`);
		} catch (error) {
			this.logger.error((error as Error).message);
		}
	}

	public listen() {
		this.client.on("ready", () => {
			this.client.user?.setActivity({ name: "Pokémon" });

			this.logger.info(`${this.client.user?.tag} is online!`);
		});

		this.client.on("interactionCreate", async (interaction) => {
			if (
				!interaction.isCommand() ||
				!interaction.guild ||
				interaction.user.bot
			)
				return;

			const command = this.commands.find(
				(command) => command.options.name === interaction.commandName
			);
			if (!command) return;

			command.exec({ bot: this, interaction });
		});

		this.client.on("messageCreate", async (message) => {
			if (!message.guildId || message.author.bot) return;

			const channel = await this.db.getChannel(message.channelId);

			if (channel.nextSpawn === 0) {
				channel.nextSpawn = Math.floor(Math.random() * 40) + 10;

				const pokemon = await this.dex.getPokemonByName(
					Math.floor(Math.random() * 897) + 1
				);
				message.channel.send({
					embeds: [
						{
							title: "A wild pokémon has appeared!",
							description:
								"Guess the pokémon and type `/catch <pokémon>` to catch it!",
							image: { url: this.util.getPokemonImage(pokemon.id) },
							color: __colors__.blue
						}
					]
				});

				channel.pokemon = pokemon.name;
				await channel.save();
			}

			channel.nextSpawn -= 1;
			await channel.save();
		});
	}

	public start() {
		this.client.login(this.token);
	}
}
