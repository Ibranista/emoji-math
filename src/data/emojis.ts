const path = "/emojis";

const emojiNames = ["grin", "pumkin", "side-eyes"] as const;

type EmojiName = (typeof emojiNames)[number];

const emojis: Record<EmojiName, string> = {} as Record<EmojiName, string>;

emojiNames.forEach((name) => {
  emojis[name] = `${path}/${name}.svg`;
});

export { emojis };
export type { EmojiName };
