import PanelItem from '@ui/PanelItem';

export default {
	title: 'Components/Panel/Item',
	component: PanelItem,
};

const Template = () => (
	<PanelItem name="John Doe" username="johndoe" src="" initials="JD" />
);

export const Default = Template.bind({});
