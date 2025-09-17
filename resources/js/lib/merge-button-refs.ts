/*
        Fungsi ini menggabungkan beberapa ref menjadi satu ref callback.
        Fungsi ini memastikan bahwa nilai ditetapkan untuk setiap ref,
        baik itu fungsi maupun objek ref yang dapat diubah.
        Fungsi ini berguna ketika Anda perlu menggabungkan ref eksternal dengan ref internal.
*/

export function mergeButtonRefs<T extends HTMLButtonElement>(refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>): React.RefCallback<T> {
    return (value) => {
        for (const ref of refs) {
            if (typeof ref === 'function') {
                ref(value);
            } else if (ref != null) {
                (ref as React.MutableRefObject<T | null>).current = value;
            }
        }
    };
}
