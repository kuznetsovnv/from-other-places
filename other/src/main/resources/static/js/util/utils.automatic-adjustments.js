// for Set<AutomaticAdjustmentStore> search
function getAdjustmentValue(adjustments, reportKey, comparableKey) {
    var value = 0;

    adjustments.forEach(function (store) {
        if (store.report === reportKey && store.comparable === comparableKey)
            value = store.value;
        if (store.report === comparableKey && store.comparable === reportKey)
            value = -store.value;
    });

    return value;
}