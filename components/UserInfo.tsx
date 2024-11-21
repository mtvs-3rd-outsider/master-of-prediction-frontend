import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import TierBadge from "@ui/TierBadge";
import moment from "moment";

interface UserInfoProps {
  name: string;
  username: string;
  date?: string; // 옵셔널로 변경
  tierName?: string; // 옵셔널로 변경
}

const UserInfo: React.FC<UserInfoProps> = ({
  name,
  username,
  date,
  tierName,
}) => {
  let formattedDate = "";

  if (date) {
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
  }

  return (
    <div className="flex flex-1 gap-x-1 items-center text-xs sm:text-sm">
      <span className="text-slate-900 font-bold">{name}</span>
      <span className="text-slate-600 font-medium">@{username}</span>
      {date && (
        <>
          <span className="text-slate-600 font-medium">·</span>
          <span className="text-slate-600 font-medium">{formattedDate}</span>
        </>
      )}
      {tierName && <TierBadge name={tierName} />}
    </div>
  );
};

export default UserInfo;
