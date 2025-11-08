import React from 'react';
import FilterButtonSmall from './FilterButtonSmall';
import TasksSortButton from './TasksSortButton';

export default function SubCategoryFilters({
    titleFilterElement,
    subCategoryFilter,
    setSubCategoryFilter,
    incrementSortMode,
    sortMode,
}: {
    titleFilterElement: React.ReactElement<
        any,
        string | React.JSXElementConstructor<any>
    >;
    subCategoryFilter: string[];
    setSubCategoryFilter: (value: string) => void; //eslint-disable-line
    incrementSortMode: (value?: string) => void; //eslint-disable-line
    sortMode: string;
}): React.ReactNode {
    return (
        <>
            {titleFilterElement}
            <div className="flex flex-wrap gap-1 items-center justify-between">
                <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-sm font-light">Show:</span>
                    {[
                        'Deadlines',
                        'Completed',
                        'Testing',
                        'Blocked',
                        // 'Other',
                    ].map((value, index) => (
                        <FilterButtonSmall
                            key={`${index}${value}`}
                            state={
                                subCategoryFilter.filter(
                                    (item) => item === value
                                )[0]
                            }
                            setState={setSubCategoryFilter}
                            message={value}
                        />
                    ))}
                </div>
                <TasksSortButton
                    incrementSortMode={incrementSortMode}
                    sortMode={sortMode}
                />
            </div>
        </>
    );
}
