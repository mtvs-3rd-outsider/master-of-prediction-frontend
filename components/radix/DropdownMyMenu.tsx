"use client";
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import cx from 'classnames';
import NavItem from '@ui/NavItem';
import { TrashIcon, PencilSquareIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import axios from '@handler/fetch/axios';

interface DropdownMenuMyDemoProps {
  feedId: string;
}

const DropdownMenuMyDemo: React.FC<DropdownMenuMyDemoProps> = ({ feedId }) => {
  const router = useRouter();

  const handleRemove = async () => {
    if (window.confirm('피드를 삭제하시겠습니까?')) {
      try {
        const response = await axios.delete(`/feeds/${feedId}`);
        if (response.status === 200) {
          alert(response.data.message);
          router.push('/'); // 홈페이지로 리다이렉트
        }
      } catch (error) {
        console.error('Error deleting feed:', error);
        alert('An error occurred while deleting the feed.');
      }
    }
  };

  const onEdit = async (e: React.MouseEvent) => {
	e.stopPropagation();
	router.push(`/edit-feed/${feedId}`); // 홈페이지로 리다이렉트
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
            <NavItem onClick={onEdit} width="full" size="small">
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