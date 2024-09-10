import { useMutation, useQueryClient, MutationFunction } from "@tanstack/react-query";

interface UseOptimisticMutationProps {
  queryKey: string | unknown[]; // queryKey를 string 또는 배열로 타입 지정
  mutationFn: MutationFunction<any, any>; // 반드시 외부에서 정의해야 하는 mutationFn
  apiPath?: string; // 필요에 따라 사용할 API 경로
  method?: string; // HTTP 메서드
  optimisticUpdate?: boolean; // 낙관적 업데이트 사용 여부
  onMutateFn?: (newData: any, previousData: any) => void; // 낙관적 업데이트 처리 함수
  onSuccessFn?: (data: any, variables: any, context: any) => void; // 성공 처리 함수
  onErrorFn?: (err: any, context: any) => void; // 에러 처리 함수
  onSettledFn?: (data: any, error: any, variables: any, context: any) => void; // 최종 처리 함수
}

const useOptimisticMutation = ({
  queryKey,
  mutationFn, // 반드시 외부에서 재정의해야 함
  optimisticUpdate = false, // 낙관적 업데이트 기본값을 true로 설정
  onMutateFn, // 낙관적 업데이트 처리 함수
  onSuccessFn, // 요청 성공 시 실행할 함수
  onErrorFn, // 에러 시 실행할 함수
  onSettledFn, // 최종적으로 실행할 함수
}: UseOptimisticMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [queryKey], // 쿼리 키
    mutationFn, // 외부에서 재정의된 mutationFn
    async onMutate(newData) {
      // 쿼리 충돌 방지
      await queryClient.cancelQueries({ queryKey: [queryKey], exact: true });

      // 이전 데이터를 가져와서 context로 저장
      const previousData = queryClient.getQueryData([queryKey]);

      // 낙관적 업데이트를 적용할지 여부 확인
      if (optimisticUpdate) {
        queryClient.setQueryData([queryKey], newData);
      }

      // onMutateFn이 있으면 실행, 없으면 기본 동작
      if (onMutateFn) {
        onMutateFn(newData, previousData);
      }

      // 이전 데이터를 반환하여 에러 시 롤백할 수 있도록 함
      return { previousData };
    },
    onError: (err, variables, context) => {
      // onErrorFn이 있으면 실행, 없으면 기본 동작
      if (onErrorFn) {
        onErrorFn(err, context);
      } else if (context?.previousData) {
        queryClient.setQueryData([queryKey], context.previousData); // 기본 롤백 처리
      }
    },
    onSuccess: (data, variables, context) => {
      // onSuccessFn이 있으면 실행, 없으면 기본 성공 처리
      if (onSuccessFn) {
        onSuccessFn(data, variables, context);
      } 
        console.log('요청 성공');
    },
    onSettled: (data, error, variables, context) => {
      // onSettledFn이 있으면 실행, 없으면 기본 쿼리 무효화 처리
      if (onSettledFn) {
        onSettledFn(data, error, variables, context);
      console.log("onSettledFn")

      } 

        queryClient.invalidateQueries({ queryKey: [queryKey] }); // 기본 쿼리 무효화
      console.log("onSettled")

    },
  });
};

export default useOptimisticMutation;
