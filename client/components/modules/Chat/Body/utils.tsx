import { Emoji, emojiIndex } from "emoji-mart";
import React from "react";
import { IMessageFragment } from "../../../stores/useChat";
import { customEmojis } from "../InputFooter/EmojiPalette/Emoji";

export const formatMessage = (
  messageFragment: IMessageFragment,
  index: number,
  array: IMessageFragment[]
) => {
  if (messageFragment.type === "text")
    return <React.Fragment key={index}>{messageFragment.msg}</React.Fragment>;
  else if (messageFragment.type === "emote") {
    if (emojiIndex.search(messageFragment.id).length > 0)
      return (
        <Emoji
          emoji={messageFragment.id}
          size={array.length === 1 ? 44 : 18}
          tooltip={true}
          key={index}
        />
      );
    else
      return (
        <img
          key={index}
          src={getCustomEmoteUrl(messageFragment.id)}
          width={array.length === 1 ? "45px" : "21px"}
          height={array.length === 1 ? "45px" : "21px"}
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
