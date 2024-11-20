import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import cx from 'classnames';
import NavItem from '@ui/NavItem';
import { TrashIcon, PencilSquareIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import axios from '@handler/fetch/axios';

interface DropdownMenuMyDemoProps {
  feedId: string | number;
  onEdit?: (e: React.MouseEvent) => void;  // onEdit prop 추가
}

const DropdownMenuMyDemo: React.FC<DropdownMenuMyDemoProps> = ({ feedId, onEdit }) => {
  const router = useRouter();

  if (!feedId) {
    console.error('feedId is undefined or null');
    return null;
  }

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();  // 이벤트 전파 중지
    if (window.confirm('피드를 삭제하시겠습니까?')) {
      try {
        const response = await axios.delete(`/feeds/${feedId}`);
        if (response.status < 300) {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error deleting feed:', error);
        alert('피드 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // onEdit prop이 제공되면 그것을 사용하고, 아니면 기본 동작 수행
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(e);
    } else {
      router.push(`/edit-feed/${feedId}`);
    }
  };

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          className="IconButton hover:bg-slate-200 rounded-full"
          aria-label="Customize options"
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
  );
};

export default DropdownMenuMyDemo;