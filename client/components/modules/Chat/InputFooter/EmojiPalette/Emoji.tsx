import data from "emoji-mart/data/google.json";
import { EmojiData, Picker } from "emoji-mart";
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
  {
    name: "Peepo bonk",
    short_names: ["peepobonk"],
    text: "",
    emoticons: [],
    keywords: ["peepo bonk", "bonk"],
    imageUrl: "/gifs/peepo-bonk.gif",
    customCategory: "Peepo",
  },
  {
    name: "Peepo box",
    short_names: ["peepobox"],
    text: "",
    emoticons: [],
    keywords: ["peepo box", "box"],
    imageUrl: "/gifs/peepo-box.gif",
    customCategory: "Peepo",
  },
  {
    name: "Peepo comfy",
    short_names: ["peepocomfy"],
    text: "",
    emoticons: [],
    keywords: ["peepo comfy", "comfy"],
    imageUrl: "/gifs/peepo-comfy.gif",
    customCategory: "Peepo",
  },
  {
    name: "Peepo cry",
    short_names: ["peepocry"],
    text: "",
    emoticons: [],
    keywords: ["peepo cry", "cry"],
    imageUrl: "/gifs/peepo-cry.gif",
    customCategory: "Peepo",
  },
  {
    name: "Peepo happy",
    short_names: ["peepohappy"],
    text: "",
    emoticons: [],
    keywords: ["peepo happy", "happy"],
    imageUrl: "/gifs/peepo-happy.gif",
    customCategory: "Peepo",
  },
  {
    name: "Peepo leave",
    short_names: ["peepoleave"],
    text: "",
    emoticons: [],
    keywords: ["peepo leave", "leave"],
    imageUrl: "/gifs/peepo-leave.gif",
    customCategory: "Peepo",
  },
  {
    name: "Peepo sad jam",
    short_names: ["peeposadjam"],
    text: "",
    emoticons: [],
    keywords: ["peepo sad jam", "sad jam"],
    imageUrl: "/gifs/peepo-sad-jam.gif",
    customCategory: "Peepo",
  },
  {
    name: "Peepo smile",
    short_names: ["peeposmile"],
    text: "",
    emoticons: [],
    keywords: ["peepo smile", "smile"],
    imageUrl: "/gifs/peepo-smile.gif",
    customCategory: "Peepo",
  },
  {
    name: "Peepo wash hands",
    short_names: ["peepowashhands"],
    text: "",
    emoticons: [],
    keywords: ["peepo wash hands", "wash hands"],
    imageUrl: "/gifs/peepo-wash-hands.gif",
    customCategory: "Peepo",
  },
  {
    name: "Peepo wine",
    short_names: ["peepowine"],
    text: "",
    emoticons: [],
    keywords: ["peepo wine", "wine"],
    imageUrl: "/gifs/peepo-wine.gif",
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
      <Picker
        style={{
          position: "absolute",
          bottom: "100%",
          left: "0px",
          display: paletteOpen ? "block" : "none",
          userSelect: "none",
        }}
        set="google"
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
