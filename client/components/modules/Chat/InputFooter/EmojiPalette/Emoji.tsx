import { EmojiData, Picker } from "emoji-mart";
import React, { useState } from "react";
import styled from "styled-components";
import EmojiIcon from "../../../../statics/icons/EmojiIcon";

const EmojiButton = styled.span`
  cursor: pointer;
`;

interface IEmoji {
    onEmojiSelect: (emoji: EmojiData) => void
}

const Emoji: React.FC<IEmoji> = ({onEmojiSelect}) => {
  const [paletteOpen, setPaletteOpen] = useState<boolean>();
  return (
    <>
      <Picker
        style={{
          position: "absolute",
          bottom: "100%",
          left: "0px",
          display: paletteOpen ? "block" : "none",
        }}
        emoji=""
        title=""
        native={true}
        onSelect={onEmojiSelect}
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
