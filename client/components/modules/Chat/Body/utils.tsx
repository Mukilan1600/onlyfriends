import { Emoji, emojiIndex } from "emoji-mart";
import React from "react";
import styled from "styled-components";
import { IMessageFragment } from "../../../stores/useChat";
import { customEmojis } from "../InputFooter/EmojiPalette/Emoji";

const StickerImage = styled.img`
  user-select: text;
  image-rendering: -webkit-optimize-contrast;
`;

export const formatMessage = (
  messageFragment: IMessageFragment,
  index: number,
  array: IMessageFragment[]
) => {
  if (messageFragment.type === "text")
    return <React.Fragment key={index}>{messageFragment.msg}</React.Fragment>;
  else if (messageFragment.type === "emote") {
    if (!isAnEmoji(messageFragment.id))
      return (
        <Emoji
          emoji={messageFragment.id}
          size={array.length === 1 ? 44 : 21}
          tooltip={true}
          key={index}
        />
      );
    else
      return (
        <StickerImage
          draggable="false"
          key={index}
          alt={`:${messageFragment.id}:`}
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
