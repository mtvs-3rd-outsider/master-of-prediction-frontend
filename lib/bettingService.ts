import apiClient from "@handler/fetch/axios";

// 배팅 상품 목록 조회 API 요청 함수
export const fetchBettingProducts = async (page: number, size = 10) => {
	const { data } = await apiClient.get("/betting-products", {
		params: { page, size },
	});
	return data; // { content, last } 형태 가정
};

// 배팅 상품 아이디에 맞춰서 feed 조회 API 요청 함수
export const fetchFeedsForBettingProducts = async (bettingIds: number[]) => {
	if (bettingIds.length === 0) return [];
	const { data } = await apiClient.get("/feeds/betting", {
		params: { ids: bettingIds.join(",") },
	});
	return data; // feed 배열을 반환한다고 가정
};