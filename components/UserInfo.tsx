import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import TierBadge from "@ui/TierBadge";
import moment from "moment";

interface UserInfoProps {
  name: string;
  username: string;
  date: string; // 예: "2024. 11. 19. 오전 10:04:17"
  tierName: string;
}

const UserInfo: React.FC<UserInfoProps> = ({
  name,
  username,
  date,
  tierName,
}) => {
  let formattedDate = "Invalid date";

  try {
    // Moment를 사용하여 문자열을 Date 객체로 변환
    const parsedDate = moment(date, "YYYY. MM. DD. A hh:mm:ss").toDate();

    // 현재 시간과 비교
    formattedDate = formatDistanceToNow(parsedDate, {
      addSuffix: true,
      locale: ko,
    });
  } catch (error) {
    console.error("Date parsing error:", error);
  }

  return (
    <div className="flex flex-1 gap-x-1 items-center text-xs sm:text-sm">
      <span className="text-slate-900 font-bold">{name}</span>
      <span className="text-slate-600 font-medium">@{username}</span>
      <span className="text-slate-600 font-medium">·</span>
      <span className="text-slate-600 font-medium">{formattedDate}</span>
      <TierBadge name={tierName} />
    </div>
  );
};

export default UserInfo;
