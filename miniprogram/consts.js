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
const SeatTypeLabelMap = [
  { type: SeatType.Empty, label: '无座位' },
  { type: SeatType.VIP, label: 'VIP单间' },
  { type: SeatType.A, label: 'A座位' },
  { type: SeatType.B, label: 'B座位' },
  { type: SeatType.C, label: 'C座位' },
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
const DurationTypeLabelMap = [
  { type: DurationType.Temp, label: '次卡' },
  { type: DurationType.Week, label: '周卡' },
  { type: DurationType.Month, label: '月卡' },
  { type: DurationType.Season, label: '季卡' },
  { type: DurationType.Year, label: '年卡' }
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
  SeatTypeLabelMap,
  SeatTypeRemote2Local,
  SeatTypeLocal2Remote,

  DurationType,
  DurationTypeArray,
  DurationTypeLabelMap,
  DurationTypeRemote2Local,
  DurationTypeLocal2Remote,
};