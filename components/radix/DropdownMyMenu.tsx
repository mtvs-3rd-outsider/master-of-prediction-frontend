import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import cx from 'classnames';
import NavItem from '@ui/NavItem';
import { TrashIcon, PencilSquareIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import axios from '@handler/fetch/axios';
import { useState } from 'react';
import GuestAuthModal from '@components/GuestAuthModal';

interface DropdownMenuMyDemoProps {
  feedId: string | number;
  onEdit?: (e: React.MouseEvent) => void;
  isGuest?: boolean;
}

const DropdownMenuMyDemo: React.FC<DropdownMenuMyDemoProps> = ({ feedId, onEdit, isGuest }) => {
  const router = useRouter();
  const [isGuestAuthModalOpen, setIsGuestAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'edit' | 'remove' | null>(null);

  if (!feedId) {
    console.error('feedId is undefined or null');
    return null;
  }

  const handleGuestAuth = async (guestId: string, guestPassword: string) => {
    try {
      const response = await axios.post(`/feeds/${feedId}/verify-guest`, {
        guestId,
        guestPassword,
      });

      if (response.status === 200) {
        setIsGuestAuthModalOpen(false);
        
        if (pendingAction === 'remove') {
          executeRemove(guestId, guestPassword);
        }
      }
    } catch (error) {
      console.error('Error during guest authentication:', error);
      const errorMessage = (error as any)?.response?.data?.message || '게스트 인증에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const executeRemove = async (guestId?: string, guestPassword?: string) => {
    if (window.confirm('피드를 삭제하시겠습니까?')) {
      try {
        const config = guestId && guestPassword ? {
          data: { guestId, guestPassword }
        } : {};
        
        const response = await axios.delete(`/feeds/${feedId}`, config);
        if (response.status < 300) {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error deleting feed:', error);
        alert('피드 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGuest) {
      setPendingAction('remove');
      setIsGuestAuthModalOpen(true);
    } else {
      executeRemove();
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(e);
    } else {
      router.push(`/edit-feed/${feedId}`);
    }
  };

  // 모달 관련 클릭 이벤트 처리 함수
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div onClick={handleModalClick}> 
        <DropdownMenuPrimitive.Root>
          <DropdownMenuPrimitive.Trigger asChild>
            <button
              className="IconButton hover:bg-slate-200 rounded-full"
              aria-label="Customize options"
              onClick={e => e.stopPropagation()} 
            >
              <EllipsisHorizontalIcon className="h-6 w-6" />
            </button>
          </DropdownMenuPrimitive.Trigger>

          <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
              sideOffset={0}
              alignOffset={0}
              align="end"
              className={cx(
                'DropdownMenuContent radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down',
                'rounded-lg shadow-2xl w-80 overflow-hidden',
                'bg-white border border-slate-200',
              )}
              onClick={e => e.stopPropagation()}  
            >
              <DropdownMenuPrimitive.Item className="focus:outline-none overflow-hidden">
                <NavItem onClick={handleEdit} width="full" size="small">
                  <PencilSquareIcon className="w-4 h-4" />
                  <div className="inline-flex flex-none text-lg font-medium">
                    Edit
                  </div>
                </NavItem>
              </DropdownMenuPrimitive.Item>
              <DropdownMenuPrimitive.Item className="focus:outline-none overflow-hidden">
                <NavItem onClick={handleRemove} width="full" size="small">
                  <TrashIcon className="w-4 h-4" />
                  <div className="inline-flex flex-none text-lg font-medium">
                    Remove
                  </div>
                </NavItem>
              </DropdownMenuPrimitive.Item>
            </DropdownMenuPrimitive.Content>
          </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
      </div>

      <div onClick={handleModalClick}>  {/* 추가된 wrapper */}
        <GuestAuthModal
          isOpen={isGuestAuthModalOpen}
          onClose={() => {
            setIsGuestAuthModalOpen(false);
            setPendingAction(null);
          }}
          onConfirm={handleGuestAuth}
        />
      </div>
    </>
  );
};

export default DropdownMenuMyDemo;