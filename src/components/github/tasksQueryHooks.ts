import { useQueryParamsToggle } from '@/utils/searchParamsURL';

export function useSortMode() {
    return useQueryParamsToggle('sm', ['Deadline', 'Created', 'Updated']);
}

export function useDateMode() {
    return useQueryParamsToggle('dm', ['build', 'live', 'test']);
}
export function useDeadlineViewMode() {
    return useQueryParamsToggle('dv', ['days', 'weeks']);
}
