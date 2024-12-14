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
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { FaShoppingCart } from "react-icons/fa";
import ConfirmDialog from "@ui/ConfirmDialog";
import ChatUI from "@ui/BettnigProductsChatRoom";

function BettingDetailPage() {
  const params = useParams();
  const [bettingInfo, setBettingInfo] = useState<BettingProductInfo>();
  const [optionsRatio, setOptionsRatio] = useState<OptionsRatio[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const { setOptionId } = BettingOptionChoiceStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // AlertDialog 상태
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [alertData, setAlertData] = useState({ amount: 0, content: "" });

  const handleOpenAlert = (amount: number, content: string) => {
    setAlertData({ amount, content });
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    description: "",
    confirmHandler: () => {},
  });
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
  const handleOpenDialog = (
    title: string,
    description: string,
    confirmHandler: () => void
  ) => {
    setDialogContent({ title, description, confirmHandler });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

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
              isWriter={bettingInfo?.isWriter || false}
              isAdmin={bettingInfo?.user?.isAdmin || false}
            />
          </main>
          <aside className="col-span-3 hidden xl:flex flex-col w-[350px]">
            <div className="  shadow-md">
              <OrderForm
                options={bettingInfo?.options || []}
                onOpenAlert={handleOpenDialog}
              />
            </div>

            <ChatUI id={params.id} />
          </aside>

          {/* 모바일 환경에서 주문하기 아이콘 */}
          <Button
            className="fixed bottom-16 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg xl:hidden flex items-center justify-center"
            onPress={onOpen}
          >
            <FaShoppingCart size={16} />
          </Button>

          <Modal isOpen={isOpen} placement="bottom-center" onClose={onClose}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalBody>
                    {/* 모달 닫기 함수 전달 */}
                    <OrderForm
                      options={bettingInfo?.options || []}
                      className="py-4"
                      onCloseModal={onClose}
                      onOpenAlert={handleOpenDialog}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={onClose}
                      className="text-sm"
                    >
                      닫기
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          {/* ConfirmDialog */}
          <ConfirmDialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            title={dialogContent.title}
            description={dialogContent.description}
            onConfirm={() => {
              dialogContent.confirmHandler();
              handleCloseDialog();
            }}
            confirmText="확인" // 추가
            cancelText="취소" // 추가
          />
        </>
      )}
    </>
  );
}

export default BettingDetailPage;
