import NavItem from '@ui/NavItem';
import { HomeIcon } from '@heroicons/react/24/outline'; // Heroicons에서 아이콘 가져오기

export default {
	title: 'Components/Nav/Item',
	component: NavItem,
};

const Template = () => (
	<NavItem href="/" width="full" size="default">
		<HomeIcon className="w-6 h-6" /> {/* Heroicons 아이콘 사용 */}
		<div className="inline-flex flex-none text-lg font-medium">Example</div>
	</NavItem>
);

export const Default = Template.bind({});
