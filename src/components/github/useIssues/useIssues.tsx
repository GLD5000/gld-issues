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
function getSessionStorageIssues() {
  return window.sessionStorage.getItem(keyName);
}
function setSessionStorageIssues(newObject: IssuesSessionObject) {
  return window.sessionStorage.setItem(keyName, JSON.stringify(newObject));
}
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
          throw new Error("Failed to fetch log file");
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
          throw new Error("Failed to fetch log file");
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
async function fetchGithubTasks(slug?: string) {
  console.log("Fetch running...");
  try {
    const response = await fetch(
      slug ? `/api/getGithubIssues/${slug}` : "/api/getGithubIssues/tasks/",
    );
    if (!response.ok) {
      throw new Error("Failed to fetch log file");
    }
    const { issues } = await response.json();
    return issues as IssuesJsonShape;
  } catch (error) {
    console.error("Error fetching log file:", error);
    return null;
  }
}
async function fetchGithubLabels() {
  console.log("Fetch labels running...");
  try {
    const response = await fetch(`/api/getGithubLabels/`);
    if (!response.ok) {
      throw new Error("Failed to fetch log file");
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
