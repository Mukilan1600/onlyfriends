import { Emoji, emojiIndex } from "emoji-mart";
import React from "react";
import styled from "styled-components";
import { IMessageFragment } from "../../../stores/useChat";
import { customEmojis } from "../InputFooter/EmojiPalette/Emoji";

const StickerImage = styled.img`
  user-select: text;
  image-rendering: -webkit-optimize-contrast;
`;

export const formatPreviewMessage = (
  messageFragment: IMessageFragment,
  index: number,
  array: IMessageFragment[]
) => {
  return formatMessage(messageFragment, index, array, "prev");
};

export const formatMessage = (
  messageFragment: IMessageFragment,
  index: number,
  array: IMessageFragment[],
  size: "prev" | "normal" = "normal"
) => {
  if (messageFragment.type === "text")
    return <React.Fragment key={index}>{messageFragment.msg}</React.Fragment>;
  else if (messageFragment.type === "emote") {
    if (!isAnEmoji(messageFragment.id))
      return (
        <Emoji
          emoji={messageFragment.id}
          size={
            array.length === 1
              ? size === "normal"
                ? 44
                : 42
              : size === "normal"
              ? 21
              : 17
          }
          tooltip={true}
          key={index}
        />
      );
    else {
      const stickerSize =
        array.length === 1
          ? size === "normal"
            ? "45px"
            : "43px"
          : size === "normal"
          ? "21px"
          : "17px";

      return (
        <StickerImage
          draggable="false"
          key={index}
          alt={`:${messageFragment.id}:`}
          src={getCustomEmoteUrl(messageFragment.id)}
          width={stickerSize}
          height={stickerSize}
        />
      );
    }
  }
};

export const isAnEmoji = (id: string) => {
  return customEmojis.findIndex((emoji) => emoji.short_names.includes(id)) >= 0;
};

const getCustomEmoteUrl = (id: string): string => {
  const emoji = customEmojis.find((emoji) => emoji.short_names.includes(id));
  if (emoji) return emoji.imageUrl;
};
