// consts.js

//与后台枚举选项内容要保持一致
const SeatType = {
  A: 'A',
  B: 'B',
  C: 'C',
  VIP: 'VIP',
}

const DurationType = {
  Temp: 'Temp',
  Week: 'Week',
  Month: 'Month',
  Season: 'Season',
  Year: 'Year',
}

const SeatTypeRemote2Local = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'VIP',
}

const DurationTypeRemote2Local = {
  1: 'Temp',
  2: 'Week',
  3: 'Month',
  4: 'Season',
  5: 'Year',
}

const SeatTypeLocal2Remote = {
  'A': '1',
  'B': '2',
  'C': '3',
  'VIP': '4',
}

const DurationTypeLocal2Remote = {
  'Temp': '1',
  'Week': '2',
  'Month': '3',
  'Season': '4',
  'Year': '5',
}

module.exports = {
  SeatType,
  DurationType,
  SeatTypeRemote2Local,
  DurationTypeRemote2Local,
  SeatTypeLocal2Remote,
  DurationTypeLocal2Remote,
};