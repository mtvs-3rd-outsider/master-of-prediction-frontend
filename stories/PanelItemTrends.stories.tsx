import PanelItemTrends from '@ui/PanelItemTrends';

export default {
	title: 'Components/Panel/ItemTrends',
	component: PanelItemTrends,
};

const Template = () => (
	<PanelItemTrends category="Design" title="Design" stat="10k" />
);

export const Default = Template.bind({});
