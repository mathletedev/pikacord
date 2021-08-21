import "dotenv-safe/config";
import Bot from "./bot";

(async () => {
	const bot = new Bot(process.env.BOT_TOKEN!, process.env.MONGO_URI!);
	await bot.loadCommands("commands");

	const args = process.argv.slice(2);
	if (args.includes("--unregister") || args.includes("-u"))
		await bot.unregisterCommands(process.env.BOT_ID!, process.env.DEV_GUILD);
	if (args.includes("--register") || args.includes("-r"))
		await bot.registerCommands(process.env.BOT_ID!, process.env.DEV_GUILD);

	bot.listen();
	bot.start();
})();
