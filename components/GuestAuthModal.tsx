import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input
} from "@nextui-org/react";

interface GuestAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (guestId: string, guestPassword: string) => void;
}

export default function GuestAuthModal({ isOpen, onClose, onConfirm }: GuestAuthModalProps) {
  const [guestId, setGuestId] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!guestId || !guestPassword) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    onConfirm(guestId, guestPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    setter(e.target.value);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      hideCloseButton
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">게스트 인증</ModalHeader>
        <ModalBody>
          <Input
            label="게스트 아이디"
            placeholder="게스트 아이디를 입력하세요"
            value={guestId}
            onChange={(e) => handleInputChange(e, setGuestId)}
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={guestPassword}
            onChange={(e) => handleInputChange(e, setGuestPassword)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </ModalBody>
        <ModalFooter>
          <Button 
            color="danger" 
            variant="light" 
            onPress={onClose}
          >
            취소
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
          >
            확인
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}