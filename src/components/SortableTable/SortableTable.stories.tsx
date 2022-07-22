import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { SortableTable } from './SortableTable'

export default {
  title: 'ReactComponentLibrary/SortableTable',
  component: SortableTable
} as ComponentMeta<typeof SortableTable>

const Template: ComponentStory<typeof SortableTable> = (args) => <SortableTable {...args} />

export const BasicTable = Template.bind({})

BasicTable.args = {
  columns: [{ name: 'id', label: 'ID' },
    { name: 'name', label: 'Name' },
    { name: 'surname', label: 'Surname' }],
  data: [{ id: 1, name: 'Brian', surname: 'May' },
    { id: 2, name: 'Saul', surname: 'Hudson' }]
}
