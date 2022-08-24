import React from 'react';
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SortableTable } from './SortableTable'
import userEvent from '@testing-library/user-event'
import { ColumnInformation } from './ColumnInformation'

interface Entry {
  id: number
  name: string
  surname: string
}

let data: Entry[] = [
  { id: 1, name: 'Brian', surname: 'May' },
  { id: 2, name: 'Saul', surname: 'Hudson' }]

let columns: Array<ColumnInformation<any>> = [
  { name: 'id', label: 'ID' },
  { name: 'name', label: 'Name' },
  { name: 'surname', label: 'Surname' }]

function getAllRows (): HTMLTableRowElement[] {
  return screen.getAllByRole('row')
}

beforeEach(() => {
  jest.resetAllMocks()
  data = [
    { id: 1, name: 'Brian', surname: 'May' },
    { id: 2, name: 'Saul', surname: 'Hudson' }]

  columns = [
    { name: 'id', label: 'ID' },
    { name: 'name', label: 'Name' },
    { name: 'surname', label: 'Surname' }]
})

describe('SortableTable should', () => {
  it('render', () => {
    render(<SortableTable data={data} columns={columns} />)
    const rows = getAllRows()
    expect(rows.length).toBe(3)
    expect((rows[0]).cells[0].textContent).toBe('ID')
    expect((rows[0]).cells[1].textContent).toBe('Name')
    expect((rows[0]).cells[2].textContent).toBe('Surname')
    expect((rows[1]).cells[0].textContent).toBe('1')
    expect((rows[1]).cells[1].textContent).toBe('Brian')
    expect((rows[1]).cells[2].textContent).toBe('May')
    expect((rows[2]).cells[0].textContent).toBe('2')
    expect((rows[2]).cells[1].textContent).toBe('Saul')
    expect((rows[2]).cells[2].textContent).toBe('Hudson')
  })

  it('render with custom element', () => {
    const cols: Array<ColumnInformation<any>> = [{
      name: 'col1',
      value: e => (<span className='customClass'>{e.prop1} {e.prop2}</span>),
      label: 'Column 1'
    }]
    const { container } = render(<SortableTable data={[{ prop1: 'hello', prop2: 'world' }]} columns={cols} />)
    const selection = container.querySelector('table tr td span.customClass')
    expect(selection).toBeTruthy()
    if (selection !== null) {
      expect(selection.textContent).toBe('hello world')
    }
  })

  it('sort', async () => {
    render(<SortableTable data={data} columns={columns} />)
    const rows = getAllRows()

    const surnameHeader = (rows[0]).cells[2].getElementsByTagName('i').item(0)
    await userEvent.click(surnameHeader as Element)
    const orderedRows = getAllRows()
    expect(rows.length).toBe(3)
    expect((orderedRows[0]).cells[0].textContent).toBe('ID')
    expect((orderedRows[1]).cells[0].textContent).toBe('2')
    expect((orderedRows[2]).cells[0].textContent).toBe('1')
  })

  it('trigger onSort', async () => {
    const onSort = jest.fn()
    render(<SortableTable data={data} columns={columns} onSort={onSort} />)
    const rows = getAllRows()
    const surnameHeader = (rows[0]).cells[2].getElementsByTagName('i').item(0)
    await userEvent.click(surnameHeader as Element)
    expect(onSort).toHaveBeenCalled()
    expect(onSort.mock.calls).toEqual([[expect.objectContaining({ name: 'surname', sortDirection: 'asc' })]])
  })

  it('change sort order when clicked twice', async () => {
    render(<SortableTable data={data} columns={columns} />)
    const rows = getAllRows()
    const surnameHeader = (rows[0]).cells[2].getElementsByTagName('i').item(0)
    await userEvent.click(surnameHeader as Element)
    const orderedRows = getAllRows()
    expect(rows.length).toBe(3)
    expect((orderedRows[0]).cells[0].textContent).toBe('ID')
    expect((orderedRows[1]).cells[0].textContent).toBe('2')
    expect((orderedRows[2]).cells[0].textContent).toBe('1')
    await userEvent.click(surnameHeader as Element)
    const orderedRows2 = getAllRows()
    expect(rows.length).toBe(3)
    expect((orderedRows2[0]).cells[0].textContent).toBe('ID')
    expect((orderedRows2[1]).cells[0].textContent).toBe('1')
    expect((orderedRows2[2]).cells[0].textContent).toBe('2')
  })

  it('use custom sort function', async () => {
    const surnameSortFunction = jest.fn()
    const columnsWithCustomSurnameSortFunction: Array<ColumnInformation<any>> = [
      { name: 'id', label: 'ID' },
      { name: 'name', label: 'Name' },
      { name: 'surname', label: 'Surname', sortFunction: surnameSortFunction }]
    render(<SortableTable data={data} columns={columnsWithCustomSurnameSortFunction} />)
    const rows = getAllRows()
    const idHeader = (rows[0]).cells[0].getElementsByTagName('i').item(0)
    await userEvent.click(idHeader as Element)
    expect(surnameSortFunction).not.toHaveBeenCalled()

    const surnameHeader = (rows[0]).cells[2].getElementsByTagName('i').item(0)
    await userEvent.click(surnameHeader as Element)
    expect(surnameSortFunction).toHaveBeenCalled()
    expect(surnameSortFunction.mock.calls).toEqual([[
      expect.objectContaining({ id: 1, name: 'Brian', surname: 'May' }),
      expect.objectContaining({ id: 2, name: 'Saul', surname: 'Hudson' })
    ]])
  })

  it('change sort icon style when clicked', async () => {
    render(<SortableTable data={data} columns={columns} />)
    const rows = getAllRows()
    const surnameHeader = (rows[0]).cells[2].getElementsByTagName('i').item(0) as Element

    expect(surnameHeader.className.trim()).toBe('bi-sort-up-alt')

    await userEvent.click(surnameHeader)
    expect(surnameHeader.className.trim()).toBe('bi-sort-up-alt text-primary bg-light border-dark')

    await userEvent.click(surnameHeader)
    expect(surnameHeader.className.trim()).toBe('bi-sort-down text-primary bg-light border-dark')
  })

  it('have different icon style if initial sort direction is different', async () => {
    const columnsWithInitialSortDirection: Array<ColumnInformation<any>> = [
      { name: 'id', label: 'ID' },
      { name: 'name', label: 'Name' },
      { name: 'surname', label: 'Surname', sortDirection: 'desc' }]
    render(<SortableTable data={data} columns={columnsWithInitialSortDirection} />)
    const rows = getAllRows()
    const surnameHeader = (rows[0]).cells[2].getElementsByTagName('i').item(0) as Element
    expect(surnameHeader.className.trim()).toBe('bi-sort-down')
  })

  it('invoke click function when clicked', async () => {
    const onClick = jest.fn()
    render(<SortableTable data={data} columns={columns} onClick={onClick} />)
    const rows = getAllRows()
    const item = rows[2].cells[1]
    await userEvent.click(item)

    expect(onClick).toHaveBeenCalled()
    expect(onClick.mock.calls).toEqual([[expect.objectContaining({ id: 2, name: 'Saul', surname: 'Hudson' })]])
  })
})
