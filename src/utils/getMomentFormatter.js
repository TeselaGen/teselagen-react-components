import moment from "moment";

export default function getMomentFormatter(format) {
  return {
    formatDate: date => moment(date).format(format),
    parseDate: str => moment(str, format).toDate(),
    placeholder: format
  };
}
