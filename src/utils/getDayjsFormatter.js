import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(LocalizedFormat);

export default function getDayjsFormatter(format) {
  return {
    formatDate: date => dayjs(date).format(format),
    parseDate: str => dayjs(str, format).toDate(),
    placeholder: format
  };
}
