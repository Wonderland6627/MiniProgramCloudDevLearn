//Date -> 2024-07-04
export function date2DateFormatStr(date) {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

//2024-07-04 -> Date
export function dateFormatStr2Date(dateStr) {
  return new Date(dateStr);
}

//Date -> 1720022400000
export function date2TimeStamp(date) {
  return date.getTime();
}

//1720022400000 -> Date
export function timeStamp2Date(timeStamp) {
  return new Date(timeStamp);
}

//2024-07-04 -> 1720022400000
export function dateFormat2TimeStamp(dateStr) {
  return Date.parse(dateStr);
}

//1720022400000 -> 2024-07-04
export function timeStamp2DateFormat(timeStamp) {
  const date = new Date(timeStamp);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

//通过时间戳计算年龄
export function calculateAgeFromTimeStamp(timeStamp) {
	const birthDate = new Date(timeStamp);
	const now = new Date();
	let age = now.getFullYear() - birthDate.getFullYear();
	const monthDiff = now.getMonth() - birthDate.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

//获取传入时间到现在的天数
export function calculateDaysDifference(timestamp) {
    const currentDate = new Date().getTime();
    const timeDiff = currentDate - timestamp;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
}

//起始日期时间戳 + 天数 返回加上天数后的日期时间戳
export function addDaysToTimeStamp(startTimeStamp, days) {
  const startDate = new Date(startTimeStamp);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);
  return endDate.getTime();
}