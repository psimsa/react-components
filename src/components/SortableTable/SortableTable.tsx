import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'

import './SortableTable.css'

import { ColumnInformation } from './ColumnInformation'
import { SortableTableProps } from './SortableTableProps'

interface SortableTableState<T> {
  columns: Array<ColumnInformation<T>>
  data: T[]
  sortColumn: ColumnInformation<T>
}

export const SortableTable: React.FC<SortableTableProps<any>> = (props) => {
  const [state, setState] = useState<SortableTableState<any>>({
    columns: props.columns.map(c => {
      if (c.sortable === undefined) {
        c.sortable = true
      }
      if (c.sortDirection === undefined) {
        c.sortDirection = 'asc'
      }
      if (c.sortFunction === undefined) {
        c.sortFunction = (a, b) => a[c.name] > b[c.name] ? 1 : -1
      }
      return c
    }),
    data: props.data,
    sortColumn: props.columns[0]
  })
  useEffect(() => {
    setState({
      data: props.data,
      columns: props.columns,
      sortColumn: props.columns[0]
    })
  }, [props])

  function sort (column: ColumnInformation<any>) {
    if (state.sortColumn === column) {
      column.sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc'
    }
    const sortedData = state.data.sort((a, b) => {
      const sortDirection = column.sortDirection === 'asc' ? 1 : -1
      // @ts-expect-error
      return sortDirection * column.sortFunction(a, b)
    })
    setState({
      ...state,
      data: sortedData,
      sortColumn: column
    })
    if (props.onSort != null) {
      props.onSort(column)
    }
  }

  return (
    <Table hover={props.onClick != null}>
      <thead>
        <tr key='table-head-row'>
          {state.columns.filter(c => !c.hidden).map(column => (
            <th key={column.name as string} className={column.extraClasses}>
              <span>{column.label}</span>
              <i
                key={column.name as string + '-sort-icon'}
                className={`bi-sort-${column.sortDirection === 'asc' ? 'up-alt' : 'down'} ${state.sortColumn.name === column.name ? 'text-primary bg-light border-dark' : ''}`}
                onClick={() => sort(column)}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {state.data.map(row => (
          <tr
            key={Object.values(row)[props.keyIndex ?? 0] as string}
            onClick={() => props.onClick != null && props.onClick(row)} className={props.onClick != null ? 'clickable-row' : ''}
          >
            {state.columns.filter(c => !c.hidden).map(column => (
              <td key={column.name as string} className={column.extraClasses}>
                {(column.value != null)
                  ? column.value(row)
                  : row[column.name]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
