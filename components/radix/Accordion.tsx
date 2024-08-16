'use client';
import { Accordion, AccordionItem } from '@nextui-org/react';
import NavItem from '@ui/NavItem';
import { ReactNode } from 'react';

import {
  ChevronDownIcon,
  ChartBarSquareIcon,
  IdentificationIcon,
  FilmIcon,
  BanknotesIcon,
  Cog8ToothIcon,
  LifebuoyIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline'; // Heroicons에서 아이콘 가져오기

interface AccordionItemProps {
  header: string;
  content?: ReactNode;
}

const items: AccordionItemProps[] = [
  {
    header: 'Creator Studio',
    content: (
      <NavItem href="/" width="full" size="default">
        <ChartBarSquareIcon className="w-4 h-4" /> {/* Heroicons 아이콘 사용 */}
        <div className="inline-flex flex-none text-sm font-medium">
          Analytics
        </div>
      </NavItem>
    ),
  },
  {
    header: 'Professional Tools',
    content: (
      <>
        <NavItem href="/" width="full" size="default">
          <IdentificationIcon className="w-4 h-4" /> {/* Heroicons 아이콘 사용 */}
          <div className="inline-flex flex-none text-sm font-medium">
            Twitter for Professionals
          </div>
        </NavItem>
        <NavItem href="/" width="full" size="default">
          <FilmIcon className="w-4 h-4" /> {/* Heroicons 아이콘 사용 */}
          <div className="inline-flex flex-none text-sm font-medium">
            Twitter Ads
          </div>
        </NavItem>
        <NavItem href="/" width="full" size="default">
          <BanknotesIcon className="w-4 h-4" /> {/* Heroicons 아이콘 사용 */}
          <div className="inline-flex flex-none text-sm font-medium">
            Monetization
          </div>
        </NavItem>
      </>
    ),
  },
  {
    header: 'Settings and Support',
    content: (
      <>
        <NavItem href="/" width="full" size="default">
          <Cog8ToothIcon className="w-4 h-4" /> {/* Heroicons 아이콘 사용 */}
          <div className="inline-flex flex-none text-sm font-medium">
            Settings and Privacy
          </div>
        </NavItem>
        <NavItem href="/" width="full" size="default">
          <LifebuoyIcon className="w-4 h-4" /> {/* Heroicons 아이콘 사용 */}
          <div className="inline-flex flex-none text-sm font-medium">
            Help Center
          </div>
        </NavItem>
        <NavItem href="/" width="full" size="default">
          <ComputerDesktopIcon className="w-4 h-4" /> {/* Heroicons 아이콘 사용 */}
          <div className="inline-flex flex-none text-sm font-medium">
            Display
          </div>
        </NavItem>
      </>
    ),
  },
];

const AccordionDemo = () => (
  <Accordion>
    {items.map(({ header, content }, i) => (
      <AccordionItem key={`header-${i}`} title={header}>
        <div className="px-4 pb-4">
          {content}
        </div>
      </AccordionItem>
    ))}
  </Accordion>
);

export default AccordionDemo;
