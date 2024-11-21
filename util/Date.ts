import { Message } from "@ui/ChatUI";
import moment from "moment";

export const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
};
  
 export const isDifferentDay = (
    currentMessage: Message,
    previousMessage?: Message
  ) => {
    return previousMessage
      ? moment.utc(currentMessage.sent).format("YYYY-MM-DD") !==
          moment.utc(previousMessage.sent).format("YYYY-MM-DD")
      : true;
  };