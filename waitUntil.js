let waitUntil = function (condition, timeout, callback, period = 200) {

    let now = Date.now(),
        isTrue = false,
        isTimeout = false;

    let wait = (condition, timeout, callback, period) => {
        setTimeout(() => {
            isTimeout = Date.now() > now + timeout;
            condition(result => {
                if (result) {
                    isTrue = true;
                }
                if (isTrue || isTimeout) {
                    if (callback) {
                        callback(isTrue);
                    }
                }
                else {
                    wait(condition, timeout, callback, period);
                }
            });
        }, period)
    };

    wait(condition, timeout, callback, period);

};

export default  waitUntil;
