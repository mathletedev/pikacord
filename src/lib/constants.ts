import { InteractionReplyOptions } from "discord.js";

export const __defaultError__: InteractionReplyOptions = {
	content: "β Something went wrong... Try again later",
	ephemeral: true
};

export const __colors__: Record<string, number> = {
	blue: 0x7289da
};

export const __emotes__: Record<string, string> = {
	pokemon: "<:pokemon:878467638802673664>"
};

export const __categories__: Record<string, string> = {
	Currency: "π°",
	PokΓ©mon: __emotes__.pokemon,
	Utilities: "π οΈ"
};

export const __pokemonStats__: Record<string, string> = {
	hp: "HP",
	attack: "Attack",
	defense: "Defense",
	"special-attack": "Sp. Atk",
	"special-defense": "Sp. Def",
	speed: "Speed"
};

export const __pokemonColors__: Record<string, number> = {
	black: 0x000000,
	blue: 0x0000ff,
	brown: 0x231709,
	gray: 0xa0a0a0,
	green: 0x00ff00,
	pink: 0xffc0cb,
	purple: 0x6603fc,
	red: 0xff0000,
	white: 0xffffff,
	yellow: 0xffff00
};

export const __pokemonTypes__: Record<string, string> = {
	normal: "βοΈ",
	fighting: "π",
	flying: "π¦",
	poison: "β οΈ",
	ground: "β°οΈ",
	rock: "π",
	bug: "π",
	ghost: "π»",
	steel: "βοΈ",
	fire: "π₯",
	water: "π§",
	grass: "βοΈ",
	electric: "β‘",
	psychic: "ποΈ",
	ice: "π§",
	dragon: "β©οΈ",
	dark: "π",
	fairy: "β€οΈ",
	unknown: "β",
	shadow: "π€"
};
