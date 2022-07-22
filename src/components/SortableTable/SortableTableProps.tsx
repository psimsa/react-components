import {ColumnInformation} from "./ColumnInformation";

export interface SortableTableProps<T> {
  columns: Array<ColumnInformation<T>>
  data: T[]
  keyIndex?: number
  onSort?: (column: ColumnInformation<T>) => void
  onClick?: (row: any) => void
}
