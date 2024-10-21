import React from 'react';

type UserRankingItemProps = {
  displayName: string;  // displayName
  userName: string;     // userName 추가
  rank: number;
  points: number;
  lastUpdated: string;
};

const UserRankingItem: React.FC<UserRankingItemProps> = ({ displayName, userName, rank, points, lastUpdated }) => {
  return (
    <li className="py-4 px-6 bg-white rounded-lg mb-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="text-gray-900 font-semibold text-2xl">
          #{rank}
        </div>
        <div>
          <p className="text-lg font-bold text-gray-700">{displayName}</p> {/* displayName 강조 */}
          <p className="text-sm text-gray-500">@{userName}</p> {/* userName은 보조 정보로 표시 */}
          <p className="text-sm text-gray-500">Last Updated: {new Date(lastUpdated).toLocaleString()}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-blue-600">{points.toFixed(2)} pts</p>
      </div>
    </li>
  );
};

export default UserRankingItem;
