import { useStore } from "@/zustand/zustand";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  IssuesSessionObject,
  SelectiveIssuesJsonShape,
  IssuesJsonShape,
  LabelsJsonShape,
} from "./useIssuesTypes";
import { convertIssuesToSelectiveIssues } from "./useIssuesUtils";

const keyName = "gitHubIssues";

/**
 * Reads the cached issues payload from session storage.
 */
function getSessionStorageIssues() {
  return window.sessionStorage.getItem(keyName);
}

/**
 * Persists the latest issues payload to session storage.
 */
function setSessionStorageIssues(newObject: IssuesSessionObject) {
  return window.sessionStorage.setItem(keyName, JSON.stringify(newObject));
}

/**
 * Merges freshly fetched issues into the cached issue list by issue number.
 */
function addFetchedIssuesToSessionStorageObject(
  newObject: SelectiveIssuesJsonShape,
) {
  const sessionStorageIssues = getSessionStorageIssues();
  if (!sessionStorageIssues) return newObject;
  const sessionStorageIssuesObject = JSON.parse(
    sessionStorageIssues,
  ) as IssuesSessionObject;
  const oldIssuesArray = sessionStorageIssuesObject.issues || [];
  newObject.forEach((issueObject) => {
    const insertIndex = oldIssuesArray?.findIndex(
      (arrayItem) => arrayItem.number === issueObject.number,
    );
    if (insertIndex > -1) {
      oldIssuesArray[insertIndex] = issueObject;
    } else {
      oldIssuesArray.unshift(issueObject);
    }
  });
  return oldIssuesArray;
}

/**
 * Provides issue and label state with helpers to refresh and mutate GitHub issues.
 */
export function useIssues(): [
  IssuesSessionObject | null,
  (
    type?: string,
    body?: {
      [key: string]: string;
    },
  ) => object,
] {
  const [state, setState] = useState<IssuesSessionObject | null>(null);
  const { accessLevel } = useStore((state) => state);
  useEffect(() => {
    /**
     * Initializes hook state from session storage and falls back to a fresh fetch.
     */
    async function initializeState() {
      try {
        const sessionStorageReturn = getSessionStorageIssues();
        const value = sessionStorageReturn
          ? JSON.parse(`${sessionStorageReturn}`)
          : undefined;
        if (value) {
          const object = value.metadata
            ? value
            : {
                issues: [...value],
                metadata: {
                  lastUpdated: undefined,
                },
              };
          setState(object as IssuesSessionObject);
        } else {
          storeNewValue(setState);
        }
      } catch (err) {
        console.error("Error initializing state:", err);
        setState(null);
      }
    }

    initializeState();
  }, [setState]);

  /**
   * Dispatches issue mutations and refreshes local state from the API.
   */
  async function refreshValue(type = "refresh", body?: Record<string, string>) {
    if (type === "close" || (type === "patchTodo" && body)) {
      const slug =
        body && body.issue_number ? `${body.issue_number}` : undefined;
      try {
        const request = {
          method: "PATCH",
          body: JSON.stringify(body),
        };
        const response = await fetch(`/api/makeGithubIssues/${type}`, request);
        if (!response.ok) {
          console.error("Failed to patch issue", {
            status: response.status,
            statusText: response.statusText,
          });
          return returnCachedIssuesWithUpdatedTimestamp(setState);
        }
        const returnValue = await response.json();
        await storeNewValue(setState, slug);
        return returnValue;
      } catch (error) {
        console.error("Error fetching log file:", error);
        return null;
      }
    } else if (type === "new" && body) {
      try {
        const request = {
          method: "POST",
          body: JSON.stringify(body),
        };
        const response = await fetch(`/api/makeGithubIssues/${type}`, request);
        if (!response.ok) {
          throw new Error("Failed to make issue");
        }
        const returnValue = await response.json();
        await storeNewValue(setState, returnValue.issue.number);
        return returnValue;
      } catch (error) {
        console.error("Error fetching log file:", error);
        return null;
      }
    } else {
      storeNewValue(setState);
    }
  }
  return accessLevel === "dev"
    ? [state, refreshValue]
    : [
        state,
        (type = "refresh") => {
          //, body?: Record<string, string>
          console.log("accessLevel:", accessLevel);
          console.log(type);
          return refreshValue();
        },
      ];
}

/**
 * Fetches tasks and labels, then updates state and session storage with the combined payload.
 */
async function storeNewValue(
  setState: Dispatch<SetStateAction<IssuesSessionObject | null>>,
  slug?: string,
) {
  const fetchedTasks = await fetchGithubTasks(slug);
  const fetchedLabels = await fetchGithubLabels();
  if (!fetchedTasks) return;
  const selectiveValue = slug
    ? addFetchedIssuesToSessionStorageObject(
        convertIssuesToSelectiveIssues(fetchedTasks),
      )
    : convertIssuesToSelectiveIssues(fetchedTasks);
  const newObject: IssuesSessionObject = {
    metadata: {
      lastUpdated: new Date().toISOString(),
    },
    issues: selectiveValue,
    labels: fetchedLabels,
  };
  setState(newObject);
  setSessionStorageIssues(newObject);
}

/**
 * Retrieves GitHub issues from the issues API, optionally scoped to a single issue slug.
 */
async function fetchGithubTasks(slug?: string) {
  console.log("Fetch running...");
  try {
    const response = await fetch(
      slug ? `/api/getGithubIssues/${slug}` : "/api/getGithubIssues/tasks/",
    );
    if (!response.ok) {
      throw new Error("Failed to fetch issues");
    }
    const { issues } = await response.json();
    return issues as IssuesJsonShape;
  } catch (error) {
    console.error("Error fetching log file:", error);
    return null;
  }
}

/**
 * Retrieves GitHub labels from the labels API.
 */
async function fetchGithubLabels() {
  console.log("Fetch labels running...");
  try {
    const response = await fetch(`/api/getGithubLabels/`);
    if (!response.ok) {
      throw new Error("Failed to fetch labels");
    }
    const {
      labels: { data },
    } = await response.json();
    return data as LabelsJsonShape;
  } catch (error) {
    console.error("Error fetching labels file:", error);
    return null;
  }
}

/**
 * Reuses cached issues while refreshing the metadata timestamp after a failed mutation.
 */
function returnCachedIssuesWithUpdatedTimestamp(
  setState: Dispatch<SetStateAction<IssuesSessionObject | null>>,
) {
  const sessionStorageReturn = getSessionStorageIssues();
  if (!sessionStorageReturn) return null;

  try {
    const parsedValue = JSON.parse(sessionStorageReturn) as IssuesSessionObject;
    const updatedValue: IssuesSessionObject = {
      ...parsedValue,
      metadata: {
        ...(parsedValue.metadata || {}),
        lastUpdated: new Date().toISOString(),
      },
    };
    setState(updatedValue);
    setSessionStorageIssues(updatedValue);
    return updatedValue;
  } catch (error) {
    console.error("Error updating cached issues timestamp:", error);
    return null;
  }
}
