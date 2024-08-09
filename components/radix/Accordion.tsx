'use client';
import { Accordion, AccordionItem } from '@nextui-org/react';
import NavItem from '@ui/NavItem';
import { ReactNode } from 'react';

import {
  HiChevronDown,
  HiOutlineChartBarSquare,
  HiOutlineIdentification,
  HiOutlineFilm,
  HiOutlineBanknotes,
  HiOutlineCog8Tooth,
  HiOutlineLifebuoy,
  HiOutlineComputerDesktop,
} from 'react-icons/hi2';

interface AccordionItemProps {
  header: string;
  content?: ReactNode;
}

const items: AccordionItemProps[] = [
  {
    header: 'Creator Studio',
    content: (
      <NavItem href="/" width="full" size="default">
        <HiOutlineChartBarSquare className="w-4 h-4" />
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
          <HiOutlineIdentification className="w-4 h-4" />
          <div className="inline-flex flex-none text-sm font-medium">
            Twitter for Professionals
          </div>
        </NavItem>
        <NavItem href="/" width="full" size="default">
          <HiOutlineFilm className="w-4 h-4" />
          <div className="inline-flex flex-none text-sm font-medium">
            Twitter Ads
          </div>
        </NavItem>
        <NavItem href="/" width="full" size="default">
          <HiOutlineBanknotes className="w-4 h-4" />
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
          <HiOutlineCog8Tooth className="w-4 h-4" />
          <div className="inline-flex flex-none text-sm font-medium">
            Settings and Privacy
          </div>
        </NavItem>
        <NavItem href="/" width="full" size="default">
          <HiOutlineLifebuoy className="w-4 h-4" />
          <div className="inline-flex flex-none text-sm font-medium">
            Help Center
          </div>
        </NavItem>
        <NavItem href="/" width="full" size="default">
          <HiOutlineComputerDesktop className="w-4 h-4" />
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
