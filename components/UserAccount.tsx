import Avatar from "@rd/Avatar";
import TierIcon from "@components/TierIcon";

interface UserAccountProps {
  userName?: string;
  avatarUrl?: string;
  displayName?: string;
  tier?: string;
  className?: string; // className 속성을 추가하여 스타일을 확장 가능
}

const UserAccount = ({
  userName,
  avatarUrl,
  displayName,
  tier,
  className,
}: UserAccountProps) => {
  return (
    <div className={`flex items-center gap-x-2 ${className}`}>
      <div className="flex items-center gap-x-3 flex-1">
        {/* 아바타 영역 */}
        <div className="flex flex-none justify-start">
          <Avatar
            src={avatarUrl || undefined} // 사용자 이미지가 없으면 기본 이미지를 사용하지 않음
            alt={userName || "사용자"}
            initials={userName ? userName[0] : "U"} // 이름의 첫 글자 표시
          />
        </div>

        {/* 사용자 정보 영역 */}
        <div className="flex flex-col">
          {/* 티어 및 사용자 이름 */}
          <div className="flex flex-1 gap-x-1 text-sm items-center">
            {tier && (
              <span className="text-xs bg-slate-200 rounded-full py-0 px-2 cursor-pointer inline-flex items-center justify-center hover:bg-slate-300">
                <TierIcon name={tier} size={15} className="mr-1 px-2" />
                {tier}
              </span>
            )}
          </div>

          {/* 사용자 표시 이름 */}
          <p className="text-base font-semibold">
            {displayName || userName || "Unknown User"}
          </p>

          {/* 사용자명 */}
          <p className="text-sm text-slate-600 font-medium">
            @{userName || "unknown"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
