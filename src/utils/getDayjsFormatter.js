import dayjs from "dayjs";

export default function getDayjsFormatter(format) {
  return {
    formatDate: date => dayjs(date).format(format),
    parseDate: str => dayjs(str, format).toDate(),
    placeholder: format
  };
}
