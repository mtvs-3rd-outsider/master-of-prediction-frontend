import { UserInfo } from "@store/useUserStore";
import { User } from "./Type";

export function toUser(userInfo: UserInfo): User {
    if (!userInfo.id) {
      throw new Error("User ID is required"); // ID가 없을 경우 예외 처리
    }
    return {
      id: userInfo.id,
      name: userInfo.displayName,
      avatarImageLink: userInfo.avatarUrl,
    };
  }