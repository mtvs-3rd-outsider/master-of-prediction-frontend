import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import TierBadge from "@ui/TierBadge";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import moment from "moment";
// import moment from "moment-timezone";

interface UserInfoProps {
  name: string;
  username?: string;
  date?: string; // 옵셔널로 변경
  tierName?: string; // 옵셔널로 변경
  isAdmin?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({
  name,
  username,
  date,
  tierName,
  isAdmin,
}) => {
  let formattedDate = "";

  if (date) {
    try {
      // 입력 시간을 Date 객체로 변환
      // Moment를 사용하여 문자열을 Date 객체로 변환
      // const parsedDate = moment(date, "YYYY. MM. DD. A hh:mm:ss").toDate();

      const parsedDate = new Date(date);

      // 유효한 날짜인지 확인
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }

      // 현재 시간과 입력 시간 비교
      formattedDate = formatDistanceToNow(parsedDate, {
        addSuffix: true, // "전" 또는 "후" 접미사 추가
        locale: ko, // 한국어 로케일
        includeSeconds: false,
      });
    } catch (error) {
      console.error("Date parsing error:", error);
    }
  }

  return (
    <div className="flex flex-1 gap-x-1 items-center text-xs sm:text-sm">
      <span className="text-slate-900 font-bold">{name}</span>
      {username && (
        <>
        <span className="text-slate-600 font-medium">@{username}</span>
        {isAdmin && <CheckCircleIcon className="w-6 h-6 text-blue-400" />}
        </>
      )}
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
