import moment from "moment";

export default function getMomentFormatter(format) {
  return {
    formatDate: function formatDate(date) {
      return moment(date).format(format);
    },
    parseDate: function parseDate(str) {
      return moment(str, format).toDate();
    },
    placeholder: format
  };
}