import Avatar from "@rd/Avatar";
import TierIcon from "@components/TierIcon";

const Account = ({ userId }: { userId: string }) => {
  console.log(userId);
  return (
    <div className="flex flex-1 items-center gap-x-2 px-4 py-8">
      <div className="flex items-center gap-x-3 flex-1">
        <div className="flex flex-1 flex-none justify-start">
          <Avatar
            // src="https://pbs.twimg.com/profile_images/1489998205236527108/q2REh8nW_400x400.jpg"
            alt="Roy Quilor"
            initials="RQ"
          />
        </div>

        <div className="flex flex-col">
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
    </div>
  );
};

export default Account;
