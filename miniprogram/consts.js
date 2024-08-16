// consts.js

//与后台枚举选项内容要保持一致

//座位相关
const SeatType = {
	Empty: 'Empty',
  VIP: 'VIP',
  A: 'A',
  B: 'B',
  C: 'C',
}
const SeatTypeArray = [
	SeatType.Empty,
	SeatType.VIP,
	SeatType.A,
	SeatType.B,
	SeatType.C,
]
const SeatTypeRemote2Local = {
	0: 'Empty',
  1: 'VIP',
  2: 'A',
  3: 'B',
  4: 'C',
}
const SeatTypeLocal2Remote = {
	'Empty': '0',
  'VIP': '1',
  'A': '2',
  'B': '3',
  'C': '4',
}

//套餐时长相关
const DurationType = {
  Temp: 'Temp',
  Week: 'Week',
  Month: 'Month',
  Season: 'Season',
  Year: 'Year',
}
const DurationTypeArray = [
	DurationType.Temp,
	DurationType.Week,
	DurationType.Month,
	DurationType.Season,
	DurationType.Year,
]
const DurationTypeRemote2Local = {
  0: 'Temp',
  1: 'Week',
  2: 'Month',
  3: 'Season',
  4: 'Year',
}
const DurationTypeLocal2Remote = {
  'Temp': '0',
  'Week': '1',
  'Month': '2',
  'Season': '3',
  'Year': '4',
}

module.exports = {
  SeatType,
	SeatTypeArray,
  SeatTypeRemote2Local,
  SeatTypeLocal2Remote,

  DurationType,
  DurationTypeArray,
  DurationTypeRemote2Local,
  DurationTypeLocal2Remote,
};