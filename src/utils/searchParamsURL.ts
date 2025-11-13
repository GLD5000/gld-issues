import { useSearchParams } from "next/navigation";
import { createStringSwitcher } from "./objectUtils";
// import { Dispatch, SetStateAction } from 'react';

export function getParam(param: string) {
  if (!window) return undefined;
  const searchString = window.location.search;
  const searchParams = new URLSearchParams(searchString);
  return decodeURIComponent(`${searchParams?.get(param)}`);
}

export function setParam(param: string, value: string) {
  if (!window) return undefined;

  if (!value || value === null || value === "null" || value === "") {
    deleteParam(param);
  } else {
    const searchString = window.location.search;
    const searchParams = new URLSearchParams(searchString);
    searchParams?.set(
      param,
      encodeURIComponent(value !== null && value !== "null" ? value : ""),
    );
    makeUrl(searchParams);
  }
}

function deleteParam(param: string) {
  if (!window) return undefined;
  const searchString = window.location.search;
  const searchParams = new URLSearchParams(searchString);
  searchParams?.delete(param);
  makeUrl(searchParams);
}

function makeUrl(searchParams: URLSearchParams) {
  const newUrl =
    searchParams?.size > 0
      ? `${window.location.protocol}//${window.location.host}${window.location.pathname}?${searchParams}`
      : `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  window.history.replaceState({}, "", newUrl);
}

export function useQueryParamsArray(
  paramKey: string,
): [string[], (valueIn: string | string[]) => void] {
  const [state, setState] = useQueryParams(paramKey);
  function updateState(newValue: string | string[]) {
    const current = getState();
    if (newValue === "DELETE") {
      deleteParam(paramKey);
      setState("");
    } else if (typeof newValue !== "string") {
      setState(JSON.stringify(newValue));
    } else if (!current) {
      setState(JSON.stringify([newValue]));
      return;
    } else if (current.includes(newValue)) {
      const newArray = current.filter((string) => string !== newValue);
      if (newArray.length === 0) {
        deleteParam(paramKey);
        setState("");
      } else {
        setState(JSON.stringify(newArray));
      }
    } else {
      current.push(newValue);
      const newString = JSON.stringify(current);
      setState(newString);
    }
  }
  function getState() {
    const current = state ? (JSON.parse(state) as string[]) : [];
    if (!current) {
      deleteParam(paramKey);
    }
    return current;
  }
  const returnState = getState();
  return [returnState, updateState];
}

// export function useQueryParams(
//     paramKey: string,
//     initialValue?: string
//
// ): [string, (valueIn: string) => void] {
//     const [state, setState] = useState<string>(initialValue || '');
//     useEffect(() => {
//         let run = true;
//         if (run && window) {
//             initializeState(setState, paramKey, initialValue);
//         }
//         return () => {
//             run = false;
//         };
//     }, [setState, paramKey, initialValue]);

//     function refreshValue(valueIn: string) {
//         storeValue(setState, paramKey, valueIn);
//     }

//     return [state, refreshValue];
// }

// function storeValue(
//     setState: Dispatch<SetStateAction<string>>,
//     paramKey: string,
//     newValue: string
// ) {
//     if (!newValue || newValue === null || newValue === 'null') {
//         setParam(paramKey, '');
//         setState('');
//     } else {
//         setParam(paramKey, newValue);
//         setState(newValue || '');
//     }
// }
// function initializeState(
//     setState: Dispatch<SetStateAction<string>>,
//     paramKey: string,
//     initialValue?: string
// ) {
//     const storedValue = getParam(paramKey);
//     if (storedValue && storedValue !== 'null') {
//         storeValue(setState, paramKey, storedValue);
//     } else if (initialValue) {
//         storeValue(setState, paramKey, initialValue);
//     }
// }

export function useQueryParams(
  paramKey: string,
  initialValue?: string,
): [string, (value: string) => void] {
  const searchParams = useSearchParams();
  const state = searchParams?.get(paramKey) || initialValue || "";

  return [
    decodeURIComponent(state),
    (value) => {
      setState(value, paramKey);
    },
  ];
}
export function useQueryParamsNumber(
  paramKey: string,
  initialValue?: number,
): [number, (value: number) => void] {
  const searchParams = useSearchParams();
  const state = searchParams?.get(paramKey) || initialValue || "";

  return [
    Number(decodeURIComponent(`${state}`)),
    (value) => {
      setState(`${value}`, paramKey);
    },
  ];
}
export function useQueryParamsboolean(
  paramKey: string,
  initialValue?: boolean,
): [boolean, (value: boolean) => void] {
  const searchParams = useSearchParams();
  const state = searchParams?.get(paramKey) || initialValue || "";

  return [
    decodeURIComponent(`${state}`) === "true",
    (value) => {
      setState(`${value}`, paramKey);
    },
  ];
}

function setState(value: string, paramKey: string) {
  if (!value || value === null || value === "null" || value === "") {
    deleteParam(paramKey);
  } else {
    const searchString = window.location.search;
    const searchParams = new URLSearchParams(searchString);
    searchParams?.set(
      paramKey,
      encodeURIComponent(value !== null && value !== "null" ? value : ""),
    );
    makeUrl(searchParams);
  }
}
export function useQueryParamsToggle(
  paramKey: string,
  optionsArray: string[],
): [string, (value?: string) => void] {
  const searchParams = useSearchParams();
  const initialValue = optionsArray[0];
  const optionSwitcher = createStringSwitcher(optionsArray);
  const state = searchParams?.get(paramKey) || initialValue || "";

  return [
    decodeURIComponent(state),

    (value?: string) => {
      setState(value || optionSwitcher[state], paramKey);
    },
  ];
}
