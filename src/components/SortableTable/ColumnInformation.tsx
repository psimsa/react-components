export interface ColumnInformation<T> {
  name: keyof T
  value?: ((value: T) => JSX.Element)
  label: string
  hidden?: boolean
  sortable?: boolean
  extraClasses?: string
  sortDirection?: 'asc' | 'desc'
  sortFunction?: (a: any, b: any) => number
}
