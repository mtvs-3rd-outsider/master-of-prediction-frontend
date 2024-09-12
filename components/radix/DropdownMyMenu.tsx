"use client";
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import cx from 'classnames';
import { ReactNode } from 'react';
import NavItem from '@ui/NavItem';

import {
	// Importing directly from @heroicons/react/outline
	TrashIcon,
	PencilSquareIcon,
    EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';

interface AccordionItem {
	href: string;
	text: string;
	width: 'full' | 'inline' | 'mobile';
	size: 'small' | 'default' | 'large';
	icon?: ReactNode;
}

const username = 'royquilor';

const items: AccordionItem[] = [
	{
		href: '/',
		text: "Edit",
		width: 'full',
		size: 'small',
		icon: <PencilSquareIcon className="w-4 h-4" />,
	},
	{
		href: '/',
		text: 'Remove',
		width: 'full',
		size: 'small',
		icon: <TrashIcon className="w-4 h-4" />,
	},
];

const DropdownMenuMyDemo = () => (
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
				{items.map(({ href, text, width, size, icon }, i) => (
					<DropdownMenuPrimitive.Item
						key={`header-${i}`}
						className="focus:outline-none overflow-hidden"
					>
						<NavItem href="{href}" width={width} size={size}>
							{icon}
							<div className="inline-flex flex-none text-lg font-medium">
								{text}
							</div>
						</NavItem>
					</DropdownMenuPrimitive.Item>
				))}
			</DropdownMenuPrimitive.Content>
		</DropdownMenuPrimitive.Portal>
	</DropdownMenuPrimitive.Root>
);

export default DropdownMenuMyDemo;
