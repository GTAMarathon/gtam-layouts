export function getRandomEmote(): string {
    const emotes = ['gtaCop', 'gtaEZ', 'gtaLove', 'gtaPOGGERS'];
    return new URL(
        `./emotes/${emotes[Math.floor(Math.random() * emotes.length)]}.png`,
        import.meta.url
    ).href;
}