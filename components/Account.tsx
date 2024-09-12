import Avatar from '@rd/Avatar';
import TierIcon from '@components/TierIcon';
import Link from 'next/link';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';  // Heroicons에서 아이콘 가져오기
import DropdownNext from '@ui/DropdownAccountNavItem';
import useUserStore from '@store/useUserStore';

interface AccountProps {
  userName?: string;
  avatarUrl?: string;
  displayName?: string;
  tier?: string;
  className?: string; // className 속성을 추가
}

const Account = ({ userName, avatarUrl, displayName, tier,className }: AccountProps) => {
  return (
    <div className={`flex flex-1 items-center gap-x-2 ${className}`}>
      <div className="flex items-center gap-x-3 flex-1">
        <div className="flex flex-1 flex-none justify-start">
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

export default Account;
