import { Emoji, emojiIndex } from "emoji-mart";
import { IMessageFragment } from "../../../stores/useChat";
import { customEmojis } from "../InputFooter/EmojiPalette/Emoji";

export const formatMessage = (messageFragment: IMessageFragment) => {
  if (messageFragment.type === "text") return messageFragment.msg;
  else if (messageFragment.type === "emote") {
    if (emojiIndex.search(messageFragment.id).length > 0)
      return <Emoji emoji={messageFragment.id} size={18} tooltip={true} />;
    else
      return (
        <img
          src={getCustomEmoteUrl(messageFragment.id)}
          width="21px"
          height="21px"
        />
      );
  }
};

export const isAnEmoji = (id: string) => {
  return customEmojis.findIndex((emoji) => emoji.short_names.includes(id)) >= 0;
};

const getCustomEmoteUrl = (id: string): string => {
  const emoji = customEmojis.find((emoji) => emoji.short_names.includes(id));
  if (emoji) return emoji.imageUrl;
};
