"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@handler/fetch/axios";
import {
  BettingCreater,
  BettingProduct,
  BettingProductInfo,
  OptionsRatio,
  PostStatsNavState,
} from "@/types/BettingTypes";
import { BettingOptionChoiceStore } from "@/hooks/GlobalBettingOption";
import NotFound from "@/app/not-found";
import BettingProductDetail from "@ui/BettingProductsDetail";
import OrderForm from "@ui/OrderForm";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { FaShoppingCart } from "react-icons/fa";

function BettingDetailPage() {
  const params = useParams();
  const [bettingInfo, setBettingInfo] = useState<BettingProductInfo>();
  const [optionsRatio, setOptionsRatio] = useState<OptionsRatio[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setOptionId } = BettingOptionChoiceStore();

  useEffect(() => {
    apiClient(`betting-products/${params.id}`)
      .then((res) => {
        const bettingInfo = res.data;
        const bettingId = [Number(params.id) * -1];
        apiClient
          .get(`/feeds/betting?ids=${bettingId}`)
          .then((response_feeds) => {
            bettingInfo.postStats = response_feeds.data[0];
            setBettingInfo(bettingInfo);
            setOptionId(res.data?.options[0]?.optionId);
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              setIsNotFound(true);
            }
          });
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setIsNotFound(true);
        }
      });

    apiClient(`/betting-products/options/ratio?bettingId=${params.id}`).then(
      (res) => {
        setOptionsRatio(res.data);
      }
    );
  }, [params.id, setOptionId]);

  return (
    <>
      {isNotFound && NotFound()}
      {!isNotFound && (
        <>
          <main className="col-span-5 w-full border-x border-slate-200">
            <BettingProductDetail
              user={bettingInfo?.user || ({} as BettingCreater)}
              product={bettingInfo?.product || ({} as BettingProduct)}
              options={bettingInfo?.options || []}
              productImages={bettingInfo?.productImages || []}
              optionsRatio={optionsRatio}
              postStats={bettingInfo?.postStats || ({} as PostStatsNavState)}
            />
          </main>
          <aside className="col-span-3 hidden xl:flex flex-col w-[350px] rou">
            <div className="sticky top-0 shadow-[0_2px_10px]  shadow-blackA2 rounded-md">
              <OrderForm options={bettingInfo?.options || []} />
            </div>
          </aside>

          {/* 모바일 환경에서 주문하기 아이콘 */}
          <button
            className="fixed bottom-16 left-10 bg-blue-600 text-white p-4 rounded-full shadow-lg xl:hidden flex items-center justify-center"
            onClick={onOpen}
          >
            <FaShoppingCart size={16} />
          </button>

          {/* 주문하기 모달 */}
          <Modal
            isOpen={isOpen}
            placement="bottom-center"
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="text-lg font-bold">
                    주문하기
                  </ModalHeader>
                  <ModalBody>
                    <OrderForm options={bettingInfo?.options || []} />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      닫기
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
}

export default BettingDetailPage;
