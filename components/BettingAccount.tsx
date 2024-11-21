import Avatar from "@rd/Avatar";
import TierBadge from "@ui/TierBadge";

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
    <div className={`relative flex items-center gap-x-2 ${className}`}>
      {/* 아바타 및 TierBadge 컨테이너 */}
      <div className="relative flex flex-none">
        <Avatar
          src={avatarUrl || undefined}
          alt={userName || "사용자"}
          initials={userName ? userName[0] : "U"}
          size={30}
        />

        {/* TierBadge - 호버 시 머리 위에 표시 */}
        {tier && (
          <div className="absolute top-[-18px] left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <TierBadge name={tier}/>
          </div>
        )}
      </div>

      {/* 텍스트 섹션 */}
      <div className="flex flex-col text-xs">
        {/* Display Name */}
        <p className="font-semibold">{displayName || userName}</p>

        {/* UserName */}
        {userName && <p className="text-slate-600 font-medium">@{userName}</p>}
      </div>
    </div>
  );
};

export default BettingAccount;
