import { Emoji } from "emoji-mart";
import { IMessageFragment } from "../../../stores/useChat";

export const formatMessage = (messageFragment: IMessageFragment) => {
  if (messageFragment.type === "text") return messageFragment.msg;
  else if (messageFragment.type === "emote")
    return (
        <Emoji emoji={messageFragment.id} size={18} tooltip={true} />
    );
};
