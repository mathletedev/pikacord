import "dotenv-safe/config";
import Bot from "./bot";

(async () => {
	const bot = new Bot(process.env.BOT_TOKEN!);

	await bot.loadCommands("commands");
	await bot.registerCommands(process.env.BOT_ID!, process.env.DEV_GUILD);

	bot.listen();
	bot.start();
})();
