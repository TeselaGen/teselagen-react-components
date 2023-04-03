import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(localeData);
dayjs.extend(LocalizedFormat);
const userLocale = Intl.DateTimeFormat().resolvedOptions().locale;

if (userLocale) {
  const localeToUse = userLocale.split("-")[0];
  require(`dayjs/locale/${localeToUse}.js`);
  dayjs.locale(localeToUse);
}

export default function getDayjsFormatter(format) {
  return {
    formatDate: date => dayjs(date).format(format),
    parseDate: str => dayjs(str, format).toDate(),
    placeholder: format?.toLowerCase().includes("l")
      ? dayjs.Ls[dayjs.locale()]?.formats[format.toUpperCase()]
      : format
  };
}
