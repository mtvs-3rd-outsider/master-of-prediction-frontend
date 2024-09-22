import Avatar from "@rd/Avatar";
import TierIcon from "@components/TierIcon";

interface AccountProps {
  userName?: string;
  avatarUrl?: string;
  displayName?: string;
  tier?: string;
  className?: string; // className 속성을 추가
}

const BettingAccount = ({
  userName,
  avatarUrl,
  displayName,
  tier,
  className,
}: AccountProps) => {
  return (
    <div className={`flex items-center gap-x-2 ${className}`}>
      <div className="flex items-center gap-x-3 flex-1">
        <div className="flexflex-none justify-start">
          <Avatar
            src={avatarUrl || undefined} // 사용자 이미지가 없으면 기본 이미지를 사용하지 않음
            alt={userName || "사용자"}
            initials={userName ? userName[0].toUpperCase() : "U"} // 이름의 첫 글자 표시
          />
        </div>

        <div className="flex flex-col">
          <div className="flex flex-1 gap-x-1 text-sm items-center">
            <span className="text-xs bg-slate-200 rounded-full py-0 px-2 cursor-pointer inline-flex items-center justify-center hover:bg-slate-300">
              <TierIcon name={tier} size={15} className="mr-1 px-2" />
              {tier}
            </span>
          </div>

          <p className="text-base font-semibold">{displayName || userName}</p>
          <p className="text-sm text-slate-600 font-medium">@{userName}</p>
        </div>
      </div>
    </div>
  );
};

export default BettingAccount;
