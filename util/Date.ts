import { Message } from "@ui/ChatUI";
import moment from "moment";

export const formatDate = (isoString: string) => {
  const date = moment(isoString);

  if (!date.isValid()) {
    console.error("Invalid date string:", isoString);
    return "Invalid Date";
  }

  return date.format("MM/DD");
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