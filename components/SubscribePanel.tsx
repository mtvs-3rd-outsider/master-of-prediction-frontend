"use client";
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
	title: string;
	href: string;
	children: ReactNode;
}

const Panel = ({ title, href, children }: Props) => (
	<div className=" rounded-xl mb-3">
		<div className="px-4 py-4">
			<h2 className="text-xl font-bold leading-none">{title}</h2>
		</div>
		{children}
	</div>
);

export default Panel;
