import Image from 'next/image';
import Head from 'next/head';

export default function RankingSystem() {
  return (
    <>
     <main className="col-span-5 w-full border-x border-slate-200">
      <Head>
        <title>Our Ranking System</title>
      </Head>

      <div className="flex flex-row justify-center">
        <section className="w-full py-12 md:py-24 lg:py-32 text-center">
          <div className="container max-w-7xl mx-auto px-4 md:px-6"> {/* 최대 너비 제한 */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-8 sm:text-5xl md:text-6xl">
                Our Ranking System
              </h1>
              <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed md:text-lg">
                저희는 포인트에 따라 사용자를 정렬하고, 일정 범위에 들어오는 사용자에게 티어를 부여하는 티어 시스템을 도입했습니다.
                이를 통해 자신의 성과를 실시간으로 확인하고, 다음 목표를 자연스럽게 설정할 수 있습니다.
                경쟁을 더욱 흥미롭게 만들어주는 이 시스템으로 더 높은 목표를 달성해보세요!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"> {/* lg:에서 3칸 그리드로 */}
              {/* 첫 번째 순위 아이템: 노스트라다무스 */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 flex items-center justify-center w-24">
                  <Image
                    className="w-full h-full object-cover"
                    src="/images/tier/nostradamus.jpeg"
                    alt="Nostradamus"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-2">노스트라다무스</h3>
                  <p className="text-gray-600">전설적인 예측자, 거의 완벽한 예측 능력을 가진 사람.</p>
                </div>
              </div>

              {/* 두 번째 순위 아이템: 예언자 */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 flex items-center justify-center w-24">
                  <Image
                    className="w-full h-full object-cover"
                    src="/images/tier/prophet.jpeg"
                    alt="Prophet"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-2">예언자</h3>
                  <p className="text-gray-600">매우 높은 예측 성공률을 가진 전문가.</p>
                </div>
              </div>

              {/* 세 번째 순위 아이템: 오라클 */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 flex items-center justify-center w-24">
                  <Image
                    className="w-full h-full object-cover"
                    src="/images/tier/oracle.jpeg"
                    alt="Oracle"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-2">오라클</h3>
                  <p className="text-gray-600">고급 예측자, 예측 능력이 뛰어난 사람.</p>
                </div>
              </div>

              {/* 네 번째 순위 아이템: 선견자 */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 flex items-center justify-center w-24">
                  <Image
                    className="w-full h-full object-cover"
                    src="/images/tier/seer.jpeg"
                    alt="Seer"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-2">선견자</h3>
                  <p className="text-gray-600">중급 예측자, 예측 능력이 어느 정도 입증된 사람.</p>
                </div>
              </div>

              {/* 다섯 번째 순위 아이템: 견습생 */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 flex items-center justify-center w-24">
                  <Image
                    className="w-full h-full object-cover"
                    src="/images/tier/apprentice.jpeg"
                    alt="Apprentice"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-2">견습생</h3>
                  <p className="text-gray-600">어느 정도의 경험을 쌓은 예측 초보자.</p>
                </div>
              </div>

              {/* 여섯 번째 순위 아이템: 초보자 */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 flex items-center justify-center w-24">
                  <Image
                    className="w-full h-full object-cover"
                    src="/images/tier/novice.jpeg"
                    alt="Novice"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-2">초보자</h3>
                  <p className="text-gray-600">예측 경험이 부족한 초보자들.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      </main>
    </>
  );
}
