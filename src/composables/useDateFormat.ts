export function useDateFormat() {
  function format(iso: string, options?: Intl.DateTimeFormatOptions) {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...options,
    })
  }
  return { format }
}
