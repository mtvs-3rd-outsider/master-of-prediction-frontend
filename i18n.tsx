import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";

// 유효한 로케일 목록
const locales = ["ko", "en"];

export default getRequestConfig(async (context) => {
  // `context`에서 locale 추출
  const locale = context.locale || "en"; // 로케일 기본값 'en'

  // setRequestLocale에 로케일 전달
  setRequestLocale(locale);

  // 로케일 유효성 검사
  if (!locales.includes(locale)) {
    notFound(); // 유효하지 않으면 404 페이지로 리디렉션
  }

  // 유효한 로케일에 맞는 메시지 파일 동적 로드
  const messages = await import(`./messages/${locale}.json`);

  return {
    messages: messages.default, // 메시지 반환
  };
});
