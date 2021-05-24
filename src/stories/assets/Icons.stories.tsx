import * as React from 'react';
import {Meta, Story} from '@storybook/react';
import {DeleteIcon, ExchangeIcon, IconProps} from '../../components/assets';

export default {
    title: 'assets/Icons',
    component: DeleteIcon,
} as Meta;

const DeleteIconTemp: Story = (args) => <DeleteIcon {...args as IconProps} />
export const deleteIcon = DeleteIconTemp.bind({});
deleteIcon.args = {
    width: '300px',
    height: '300px',
    color: '#000',
    onClick: () => {}
} as IconProps

const ExchangeIconTemp: Story = (args) => <ExchangeIcon {...args as IconProps} />
export const exchangeIcon = ExchangeIconTemp.bind({});
exchangeIcon.args = {
    width: '300px',
    height: '300px',
    color: '#000',
    onClick: () => {}
} as IconProps