import React from 'react';
import AdBanner from './AdBanner';
import Footer from './Footer';

const GuideSection: React.FC = () => {
  return (
    <aside className="col-span-3 hidden xl:flex flex-col w-[350px]">
    <div className="sticky top-0 bottom-0 p-4  ">
      {/* <h2 className="text-xl font-bold mb-4">플랫폼 가이드: 예측의 달인</h2> */}
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold"> 환영합니다!</h3>
        <p className="text-sm text-gray-600">
          예측 플랫폼에 오신 것을 환영합니다. 이곳에서 예측 실력을 발휘하고, 다른 사용자와 경쟁을 통해 실력을 쌓을 수 있습니다.
        </p>
      </div>
  
      <div className="mb-6">
        <h3 className="text-lg font-semibold">1. 예측 시작하기</h3>
        <p className="text-sm text-gray-600">
          <strong>1단계:</strong> 예측 이벤트에 참여하고, 승률을 예측해보세요.<br />
          <strong>2단계:</strong> 예측 결과에 따라 보상을 획득하세요.
        </p>
      </div>
  
      <div className="mb-6">
        <h3 className="text-lg font-semibold">2. 보상 시스템</h3>
        <p className="text-sm text-gray-600">
          예측 성공 시 포인트와 보상을 받습니다. 상위 순위에 오를수록 더 많은 보상을 획득할 수 있습니다.
        </p>
      </div>
  
      <div className="mb-6">
        <h3 className="text-lg font-semibold">3. 순위와 통계</h3>
        <p className="text-sm text-gray-600">
          리더보드에서 순위와 예측 성공률을 확인하고, 개인 통계 페이지에서 누적 보상 및 참여 횟수를 볼 수 있습니다.
        </p>
      </div>
  
      <div className="mb-6">
        <h3 className="text-lg font-semibold">4. 커뮤니티 기능</h3>
        <p className="text-sm text-gray-600">
          다른 사용자와 예측 정보를 공유하거나 토론에 참여하며, 더 나은 배팅 전략을 세워보세요.
        </p>
      </div>
  
      <div>
        <h3 className="text-lg font-semibold">5. 안전한 배팅</h3>
        <p className="text-sm text-gray-600">
          모든 예측은 공정하게 처리되며, 사용자의 데이터를 안전하게 보호합니다. 책임감 있게 예측하세요.
        </p>
      </div>
    </div>
    <AdBanner
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
          dataAdSlot="2358632947348636"
          />
          <Footer />
  </aside>)
};

export default GuideSection;
