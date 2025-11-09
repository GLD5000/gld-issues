export type Issue = {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: false;
  };
  labels: [
    {
      id: number;
      node_id: string;
      url: string;
      name: string;
      color: string;
      default: false;
      description: string;
    },
    {
      id: number;
      node_id: string;
      url: string;
      name: string;
      color: string;
      default: false;
      description: string;
    },
  ];
  state: string;
  locked: false;
  assignee: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: false;
  };
  assignees: [
    {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      user_view_type: string;
      site_admin: false;
    },
  ];
  milestone: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string;
  author_association: string;
  active_lock_reason: string;
  body: string;
  closed_by: string;
  reactions: {
    url: string;
    total_count: number;
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: 0;
  };
  timeline_url: string;
  performed_via_github_app: string;
  state_reason: string;
};
// Define the type for an array of issues

export type SelectiveIssueLabel = {
  // id: number;
  // node_id: string;
  // url: string;
  name: string;
  color: string;
  // default: false;
  description: string;
};
export type SelectiveIssueBody = {
  links: string[];
  taskLists: string[];
};

export type SelectiveIssue = {
  number: number;
  title: string;
  labels: SelectiveIssueLabel[];
  state: string;
  assignee: string;
  milestone: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string;
  body: SelectiveIssueBody; //Strip out task list and links
  state_reason: string;
};

export type IssuesJsonShape = Issue[];
export type SelectiveIssuesJsonShape = SelectiveIssue[];

export type IssuesSessionObject = {
  metadata: { lastUpdated: string };
  issues: SelectiveIssuesJsonShape | null;
};
