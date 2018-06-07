package com.other.util;

import com.other.domain.AutomaticAdjustmentStore;
import lombok.SneakyThrows;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class AutomaticAdjustmentsUtil {

    private static final String ADJUSTMENTS_ENUM_PACKAGE = "com.other.enum.adjustments";
    @SneakyThrows
    public static Class<?> findClassByName(String name) {
        return Class.forName(ADJUSTMENTS_ENUM_PACKAGE + "." + name);
    }

    /**
     * Example for Set<AutomaticAdjustmentStore<FloorAdjustmentType>>:
     * [ FIRST, MIDDLE,  5]
     * [ FIRST,   LAST, 10]
     * [MIDDLE,   LAST, 15]
     * =>
     * [ -,  -, -]
     * [ 5,  -, -]
     * [10, 15, -]
     *
     * Set == null returns table with 0 values.
     *
     * @param adjSet
     * @param enumClass
     * @return Integer[][]
     */
    public static <T extends Enum> Integer[][] transformToTable(Set<AutomaticAdjustmentStore<T>> adjSet, Class<T> enumClass) {
        T[] types = enumClass.getEnumConstants();
        Integer[][] adjTable = new Integer[types.length][types.length];
        for (int i = 0; i < types.length; i++) {
            for (int j = 0; j < types.length; j++) {
                if (i > j) {
                    int value = 0;
                    if (adjSet != null) {
                        for (AutomaticAdjustmentStore<T> adj : adjSet) {
                            if (adj.isTheSame(types[i], types[j])) {
                                value = adj.getValue();
                                break;
                            }
                        }
                    }
                    adjTable[i][j] = value;
                }
            }
        }
        return adjTable;
    }

    /**
     * Example for Integer[][]:
     * [ -,  -, -]
     * [ 5,  -, -]
     * [10, 15, -]
     * =>
     * [ FIRST, MIDDLE,  5]
     * [ FIRST,   LAST, 10]
     * [MIDDLE,   LAST, 15]
     *
     * @param adjTable
     * @param enumClass
     * @return Set<AutomaticAdjustmentStore<T>>
     */
    public static <T extends Enum> Set<AutomaticAdjustmentStore<T>> transformToMap(List<List<Integer>> adjTable, Class<T> enumClass) {
        Set<AutomaticAdjustmentStore<T>> adjSet = new HashSet<>();
        T[] types = enumClass.getEnumConstants();
        for (int i = 0; i < types.length; i++) {
            for (int j = 0; j < types.length; j++) {
                if (i > j) {
                    Integer value = adjTable.get(i).get(j);
                    adjSet.add(new AutomaticAdjustmentStore<>(types[i], types[j], value));
                }
            }
        }

        return adjSet;
    }
}
