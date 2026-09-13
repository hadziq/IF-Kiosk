// Indonesian day names indexed to match Date#getDay() (0 = Minggu).
const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

// Days that can carry a teaching schedule.
const WEEKDAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

const dayNameOf = (date) => DAY_NAMES[new Date(date).getDay()];

module.exports = { DAY_NAMES, WEEKDAYS, dayNameOf };
