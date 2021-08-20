import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { BitFieldResolvable, Client, Intents, IntentsString } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import Command from "./commands/command";
import { Logger } from "./utils/logger";
import { Util } from "./utils/util";

export default class Bot {
	public client: Client;
	private rest = new REST({ version: "9" });
	private commands: Command[] = [];
	private token: string;
	public logger = new Logger();
	public util = new Util(this);

	public constructor(
		token: string,
		intents: BitFieldResolvable<IntentsString, number> = [Intents.FLAGS.GUILDS]
	) {
		this.token = token;

		this.client = new Client({ intents });
		this.rest.setToken(token);
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

	public listen() {
		this.client.on("ready", () =>
			this.logger.info(`${this.client.user?.tag} is online!`)
		);

		this.client.on("interactionCreate", async (interaction) => {
			if (!interaction.isCommand() || !interaction.guild) return;

			const command = this.commands.find(
				(command) => command.options.name === interaction.commandName
			);
			if (!command) return;

			command.exec({ bot: this, interaction });
		});
	}

	public start() {
		this.client.login(this.token);

		this.client.user?.setActivity({ name: "Pokémon" });
	}
}