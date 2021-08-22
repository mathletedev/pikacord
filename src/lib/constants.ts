import { InteractionReplyOptions } from "discord.js";

export const __defaultError__: InteractionReplyOptions = {
	content: "❌ Something went wrong... Try again later",
	ephemeral: true
};

export const __colors__: Record<string, number> = {
	blue: 0x7289da
};

export const __emotes__: Record<string, string> = {
	pokemon: "<:pokemon:878467638802673664>"
};

export const __categories__: Record<string, string> = {
	Currency: "💰",
	Pokémon: __emotes__.pokemon,
	Utilities: "🛠️"
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
	normal: "☀️",
	fighting: "👊",
	flying: "🦋",
	poison: "☠️",
	ground: "⛰️",
	rock: "💎",
	bug: "🐛",
	ghost: "👻",
	steel: "⚙️",
	fire: "🔥",
	water: "💧",
	grass: "☘️",
	electric: "⚡",
	psychic: "👁️",
	ice: "🧊",
	dragon: "⛩️",
	dark: "🌑",
	fairy: "❤️",
	unknown: "❓",
	shadow: "👤"
};
