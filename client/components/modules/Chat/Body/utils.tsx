import { Emoji, emojiIndex } from "emoji-mart";
import React from "react";
import styled from "styled-components";
import { IMessage, IMessageFragment } from "../../../stores/useChat";
import { customEmojis } from "../InputFooter/EmojiPalette/Emoji";

const StickerImage = styled.img`
  user-select: text;
  image-rendering: -webkit-optimize-contrast;
`;

const Link = styled.a`
  &:hover {
    text-decoration: underline;
  }
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
  } else if (messageFragment.type === "link") {
    return size === "normal" ? (
      <Link
        href={messageFragment.msg}
        target="_blank"
        title={messageFragment.msg}
        key={index}
      >
        {messageFragment.msg}
      </Link>
    ) : (
      <span key={index}>{messageFragment.msg}</span>
    );
  }
};

export const formatFileMessage = (
  message: IMessage,
  downloadFile: () => void
) => {
  return (
    <div
      style={{
        height: "100%",
        minHeight: "60px",
        padding: "5px 10px",
        whiteSpace: "nowrap",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(0,0,0,0.2)",
      }}
    >
      <span
        style={{ width: "80%", overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {message.fileName}
      </span>
      <button onClick={downloadFile}>download</button>
    </div>
  );
};

export const isAnEmoji = (id: string) => {
  return customEmojis.findIndex((emoji) => emoji.short_names.includes(id)) >= 0;
};

const getCustomEmoteUrl = (id: string): string => {
  const emoji = customEmojis.find((emoji) => emoji.short_names.includes(id));
  if (emoji) return emoji.imageUrl;
};
