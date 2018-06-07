package com.other.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AutomaticAdjustmentStore<T extends Enum> {
    T report;
    T comparable;
    Integer value;

    /**
     * We always store only report:comparable link. Otherwise - same value multiply -1.
     */
    public boolean isTheSame(T value, T value2) {
        return report.equals(value) && comparable.equals(value2) || report.equals(value2) && comparable.equals(value);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AutomaticAdjustmentStore<?> that = (AutomaticAdjustmentStore<?>) o;
        return Objects.equals(report, that.report) &&
                Objects.equals(comparable, that.comparable);
    }

    @Override
    public int hashCode() {
        return Objects.hash(report, comparable);
    }
}
