import Avatar from '@rd/Avatar';
import TierIcon from '@components/TierIcon';
import Link from 'next/link';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';  // Heroicons에서 아이콘 가져오기

const AccountNavItem = () => (
	<div className="flex flex-1 items-center gap-x-2 px-4 py-8 ">
		<div className="flex items-center gap-x-3 flex-1">
			<div className="flex flex-1 xl:flex-none justify-center xl:justify-start">
				<Avatar
					// src="https://pbs.twimg.com/profile_images/1489998205236527108/q2REh8nW_400x400.jpg"
					alt="Roy Quilor"
					initials="RQ"
				/>
			</div>
			
			<div className="hidden xl:flex flex-col">
				<div className="flex flex-1 gap-x-1 text-sm items-center">
					<span className="text-xs bg-slate-200 rounded-full py-0 px-2 cursor-pointer inline-flex items-center justify-center hover:bg-slate-300">
						<TierIcon name="노스트라다무스" size={15} className="mr-1 px-2" />
						노스트라다무스
					</span>
				</div>

				<p className="text-base font-semibold">Roy Quilor</p>
				<p className="text-sm text-slate-600 font-medium">@RoyQuilor</p>
			</div>
		</div>
		<div className="hidden xl:flex">
			<Link href="/">
				<EllipsisHorizontalIcon className="w-6 h-6" />  {/* Heroicons 아이콘 사용 */}
			</Link>
		</div>
	</div>
);

export default AccountNavItem;
