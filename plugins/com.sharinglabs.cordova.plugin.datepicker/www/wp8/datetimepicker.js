    var exec = require('cordova/exec');

    function DatePicker() {
      this._callback;
    }

    DatePicker.prototype.show = function (options, cb) {
        var padDate = function (date) {
            if (date.length == 1) {
                return ("0" + date);
            }
            return date;
        };
        
        var formatDate = function (date) {
            date = new Date(date);
            return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
        }
        if (options.date) {
            options.date = formatDate(options.date);
        }

        if (options.minDate) {
            options.minDate = formatDate(options.minDate);
        }

        if (options.maxDate) {
            options.maxDate = formatDate(options.maxDate);
        }
        var onSuccess = function (date) {
            var d = new Date(parseInt(date,10));
            if (cb) {
                cb(d);
            }
        }
        if (options.mode == 'date') {
            exec(onSuccess,
              null,
              "DateTimePicker",
              "selectDate",
              [options.date]
            );
        } else {
            exec(onSuccess,
              null,
              "DateTimePicker",
              "selectTime",
              [options.date]
            );
        }
    }

    var datePicker = new DatePicker();
    module.exports = datePicker;
    if (!window.plugins) {
        window.plugins = {};
    }
    if(!window.plugins.datePciker) {
        window.plugins.datePicker = datePicker;
    }
