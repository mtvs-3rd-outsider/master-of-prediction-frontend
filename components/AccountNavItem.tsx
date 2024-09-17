import Avatar from '@rd/Avatar';
import TierIcon from '@components/TierIcon';
import Link from 'next/link';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';  // Heroicons에서 아이콘 가져오기
import DropdownNext from '@ui/DropdownAccountNavItem';
import useUserStore from '@store/useUserStore';

const AccountNavItem = () => {
  // useUserStore에서 사용자 정보를 가져옴 (null일 수 있음)
  const { userInfo } = useUserStore();

  // userInfo가 null인지 확인하여 속성에 접근
  if (!userInfo) {
    return (
      <div className="flex flex-1 items-center gap-x-2 px-4 py-8">
        <div className="flex items-center gap-x-3 flex-1">
          <p className="text-sm">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }
  // userInfo가 null이 아닌 경우 데이터 사용
  const { userName, avatarUrl, tier, displayName } = userInfo;
  // 권한이나 티어에 따라 사용자 티어 설정 (기본 값은 '회원')
  const userTier = tier; 

  return (
    <div className="flex flex-1 items-center gap-x-2 px-4 py-8">
      <div className="flex items-center gap-x-3 flex-1">
        <div className="flex flex-1 xl:flex-none justify-center xl:justify-start">
          <Avatar
            src={avatarUrl } // 사용자 이미지가 없으면 기본 이미지 사용
            alt={userName || "사용자"}
            initials={userName ? userName[0].toUpperCase() : "U"} // 이름의 첫 글자 표시
          />
        </div>

        <div className="hidden xl:flex flex-col">
          <div className="flex flex-1 gap-x-1 text-sm items-center">
            <span className="text-xs bg-slate-200 rounded-full py-0 px-2 cursor-pointer inline-flex items-center justify-center hover:bg-slate-300">
              <TierIcon name={userTier} size={15} className="mr-1 px-2" />
              {userTier}
            </span>
          </div>

          <p className="text-base font-semibold">{displayName || userName }</p>
          <p className="text-sm text-slate-600 font-medium">@{userName || "username"}</p>
        </div>
      </div>

      <div className="hidden xl:flex">
        <DropdownNext />
      </div>
    </div>
  );
};

export default AccountNavItem;
