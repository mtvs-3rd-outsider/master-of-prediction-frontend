import { UserInfo } from "@store/useUserStore";
import { User } from "./Type";

export function toUser(userInfo: UserInfo| null): User {
    if (!userInfo || !userInfo.id) {
        throw new Error("User ID is required"); // userInfo나 ID가 없는 경우 예외 처리
    }
    return {
      id: userInfo.id,
      name: userInfo.displayName,
      avatarImageLink: userInfo.avatarUrl,
    };
  }