/// <reference types="react-scripts" />

declare module 'atomize';

interface IUser {
  id: string;
  private: {
    name: string;
    email: string;
    photoUrl: string;
  };
  metadatumByUserId?: IUserMetadata;
}

interface IUserMetadata {
  id: string;
  name: string;
  photoUrl?: string;
  photo?: IAsset;
}

interface IAsset {
  id: string;
  location: string;
  filename: string;
}

interface ICategory {
  id: string;
  name: string;
  slug: string;
  hex: string;
  emoji: string;
  issues?: {
    totalCount: number;
    nodes: IIssue[];
  };
}

interface IIssue {
  id: string;
  summary: string;
  description: string;
  voteCount: number;
  category: ICategory;
  requestor: IUser;
  image: IAsset;
  issueStatusByIssueId: IIssueStatus;
  comments: {
    totalCount: number;
  };
  createdAt: string;
}

interface IIssueStatus {
  id: string;
  status: {
    name: string;
  };
}

interface IIssueVote {
  id: string;
  user: {
    id: string;
  };
  issue: {
    id: string;
  };
}
