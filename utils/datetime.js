const moment = require('moment');

var self = module.exports = {

    // Get current date time.
    getNow: () => {
        return moment().toDate();
    },

    getTime: () => {
        return moment().format('HH:mm:ss');
    },

    getDate: () => {
        return moment().format('MM-DD-YYYY');
    },

    getTransactionDateFormat: () => {
        return moment().format('MM-DD-YYYY HH:mm:ss');
    },

    // Returns the day number starting from 0 (Sunday)
    getDayNumberByDate: (date) => {
        return moment(date).format('d');
    },


    getDayNameByDate: (date) => {
        var dayNumber = self.getDayNumberByDate(date);

        switch (dayNumber) {
            case '0':
                return 'sunday';
            case '1':
                return 'monday';
            case '2':
                return 'tuesday';
            case '3':
                return 'wednesday';
            case '4':
                return 'thursday';
            case '5':
                return 'friday';
            case '6':
                return 'saturday';
            default: return '';
        }
    },

    getDateByFormat: (format) => {
        return moment().format(format);
    },

    getUnixTimestamp: () => {
        return moment().unix();
    },

    diffInMinutesAndSecondsFormat: (start, end) => {
        return moment.utc(moment(end).diff(moment(start))).format("HH:mm:ss");
    },

    isBetweenDate: (compareDate, startDate, endDate) => {
        compareDate = moment(compareDate);
        return compareDate.isBetween(moment(startDate), moment(endDate));
    },

    isBetweenTime: (compareTime, startTime, endTime) => {
        var format = 'HH:mm';
        var now = moment();
        compareTime = moment(compareTime);
        compareTime = moment(now.format("YYYY-MM-DD") + ' ' + compareTime.format(format)).utcOffset("+0800");
        startTime = moment(startTime, format);
        endTime = moment(endTime, format);

        return compareTime.isAfter(startTime) && compareTime.isBefore(endTime);
    },
};