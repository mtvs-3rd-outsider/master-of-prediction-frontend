import { UserInfo } from "@store/useUserStore";
import { User } from "./Type";

export function toUser(userInfo: UserInfo | null): User | null {
    if (!userInfo || !userInfo.id) {
        // userInfo가 null이거나 ID가 없으면 null 반환
        return null;
    }
    return {
        id: userInfo.id,
        name: userInfo.displayName,
        avatarImageLink: userInfo.avatarUrl,
        userName: userInfo.userName,
    };
}
