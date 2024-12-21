
const dateTimeOptions = {
  dateStyle: 'short' as const,
  timeStyle: 'short' as const,
  hourCycle: 'h24' as const,
};

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', dateTimeOptions).format(date);
};
export function useFormatters() {

  return {
    formatDateTime
  }
}