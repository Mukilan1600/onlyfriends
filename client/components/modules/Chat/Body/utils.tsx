import { Emoji } from "emoji-mart";
import React from "react";
import styled from "styled-components";
import FileIcon from "../../../statics/icons/FileIcon";
import { IMessage, IMessageFragment } from "../../../stores/useChat";
import { customEmojis } from "../InputFooter/EmojiPalette/Emoji";

const StickerImage = styled.img<{ single: boolean }>`
  user-select: text;
  image-rendering: -webkit-optimize-contrast;
  margin: ${({ single }) => (single ? "0 17px 17px 17px" : "0px")};
`;

const Link = styled.a`
  &:hover {
    text-decoration: underline;
  }
`;

export const formatPreviewMessage = (messageFragment: IMessageFragment, index: number, array: IMessageFragment[]) => {
  return formatMessage(messageFragment, index, array, "prev");
};

export const formatMessage = (messageFragment: IMessageFragment, index: number, array: IMessageFragment[], size: "prev" | "normal" = "normal") => {
  if (messageFragment.type === "text") return <React.Fragment key={index}>{messageFragment.msg}</React.Fragment>;
  else if (messageFragment.type === "emote") {
    if (!isAnEmoji(messageFragment.id))
      return (
        <Emoji
          emoji={messageFragment.id}
          size={array.length === 1 ? (size === "normal" ? 44 : 42) : size === "normal" ? 21 : 17}
          tooltip={true}
          key={index}
        />
      );
    else {
      const stickerSize = array.length === 1 ? (size === "normal" ? "45px" : "43px") : size === "normal" ? "21px" : "17px";

      return (
        <StickerImage
          single={array.length === 1}
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
      <Link href={messageFragment.msg} target="_blank" title={messageFragment.msg} key={index}>
        {messageFragment.msg}
      </Link>
    ) : (
      <span key={index}>{messageFragment.msg}</span>
    );
  }
};

export const formatFileMessage = (message: IMessage, prev: boolean = true, sentByMe: boolean = true) => {
  if (message.fileType === "file" || prev) {
    return (
      <div
        style={{
          padding: "10px 15px",
          whiteSpace: "nowrap",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <FileIcon fill={sentByMe ? "#525252" : "#FFFFFF"} />
          <span
            style={{
              width: "170px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginLeft: "9px",
              direction: "rtl",
              textAlign: "left",
            }}
            title={message.fileName}
          >
            {message.fileName}
          </span>
        </div>
      </div>
    );
  } else if (message.fileType === "image") {
    return <img src={message.fileUrl} alt="image message" style={{width: "100%", height: "100%"}}/>;
  } else {
    return <video src={message.fileUrl} controls style={{width: "100%", height: "100%"}}/>;
  }
};

export const isAnEmoji = (id: string) => {
  return customEmojis.findIndex((emoji) => emoji.short_names.includes(id)) >= 0;
};

const getCustomEmoteUrl = (id: string): string => {
  const emoji = customEmojis.find((emoji) => emoji.short_names.includes(id));
  if (emoji) return emoji.imageUrl;
};
