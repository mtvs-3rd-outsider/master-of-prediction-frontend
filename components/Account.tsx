import Avatar from "@rd/Avatar";
import TierBadge from "@ui/TierBadge";

interface AccountProps {
  userName?: string;
  avatarUrl?: string;
  displayName?: string;
  tier?: string;
  className?: string; // className 속성을 추가
  onClick?: () => void;
}

const Account = ({
  userName,
  avatarUrl,
  displayName,
  tier,
  className,
  onClick,
}: AccountProps) => {
  return (
    <div
      className={`relative flex items-center gap-x-4 ${className}`}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      {/* 아바타 및 TierBadge 컨테이너 */}
      <div className="relative flex flex-none">
        <Avatar
          src={avatarUrl || undefined} // 사용자 이미지가 없으면 기본 이미지를 사용하지 않음
          alt={displayName || "사용자"}
          initials={displayName ? displayName[0] : "U"} // 이름의 첫 글자 표시
        />

        {/* TierBadge - 유저 머리 위에 표시 */}
        {tier && (
          <div className="absolute top-[-24px] left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <TierBadge name={tier} />
          </div>
        )}
      </div>

      {/* 텍스트 섹션 */}
      <div className="flex flex-col">
        {/* Display Name */}
        <p className="text-base font-semibold">{displayName || userName}</p>

        {/* UserName */}
        {userName && (
          <p className="text-sm text-slate-600 font-medium">@{userName}</p>
        )}
      </div>
    </div>
  );
};

export default Account;
