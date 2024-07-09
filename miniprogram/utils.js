export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

//Date -> 2024-07-04
function Date2DateFormatStr(date) {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

//2024-07-04 -> Date
function DateFormatStr2Date(dateStr) {
  return new Date(dateStr);
}

//Date -> 1720022400000
function Date2TimeStamp(date) {
  return date.getTime();
}

//1720022400000 -> Date
function TimeStamp2Date(timeStamp) {
  return new Date(timeStamp);
}

//2024-07-04 -> 1720022400000
function DateFormat2TimeStamp(dateStr) {
  return Date.parse(dateStr);
}

//1720022400000 -> 2024-07-04
function TimeStamp2DateFormat(timeStamp) {
  const date = new Date(timeStamp);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}