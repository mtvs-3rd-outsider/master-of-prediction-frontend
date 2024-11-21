import React from 'react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";

interface GuestLoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (guestId: string, guestPassword: string) => void;
}

const GuestLoginModal: React.FC<GuestLoginModalProps> = ({
  isOpen,
  onOpenChange,
  onSubmit
}) => {
  const [guestId, setGuestId] = React.useState("");
  const [guestPassword, setGuestPassword] = React.useState("");

  const handleSubmit = () => {
    if (guestId && guestPassword) {
      onSubmit(guestId, guestPassword);
      onOpenChange(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">게스트로 작성하기</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="게스트 아이디"
                placeholder="게스트 아이디를 입력하세요"
                variant="bordered"
                value={guestId}
                onChange={(e) => setGuestId(e.target.value)}
              />
              <Input
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                type="password"
                variant="bordered"
                value={guestPassword}
                onChange={(e) => setGuestPassword(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                * 게시물 수정/삭제 시 필요하니 잊지 마세요
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                취소
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                확인
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default GuestLoginModal;