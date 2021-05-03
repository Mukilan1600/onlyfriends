import data from "emoji-mart/data/google.json";
import { EmojiData, NimblePicker } from "emoji-mart";
import React, { useState } from "react";
import styled from "styled-components";
import EmojiIcon from "../../../../statics/icons/EmojiIcon";

export const customEmojis = [
  {
    name: "Peepo cry shutdown",
    short_names: ["peepocryshut"],
    text: "",
    emoticons: [],
    keywords: ["peepo cry", "peepo cry shutdown", "peepo shutdown"],
    imageUrl: "/gifs/peepo-cry-shutdown.gif",
    customCategory: "Peepo",
  },
];

const EmojiButton = styled.span`
  cursor: pointer;
`;

interface IEmoji {
  onEmojiSelect: (emoji: EmojiData) => void;
}

const Emoji: React.FC<IEmoji> = ({ onEmojiSelect }) => {
  const [paletteOpen, setPaletteOpen] = useState<boolean>();
  return (
    <>
      <NimblePicker
        style={{
          position: "absolute",
          bottom: "100%",
          left: "0px",
          display: paletteOpen ? "block" : "none",
          userSelect: "none",
        }}
        set="google"
        data={data}
        emoji=""
        title=""
        onSelect={onEmojiSelect}
        custom={customEmojis}
      />
      <div style={{ position: "relative" }}>
        <EmojiButton onClick={() => setPaletteOpen(!paletteOpen)}>
          <EmojiIcon />
        </EmojiButton>
      </div>
    </>
  );
};

export default Emoji;
