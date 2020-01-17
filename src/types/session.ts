export interface ISessionData {
  sessions: ISession[];
  speakers: ISpeaker[];
  session_types: ISessionType[];
  rooms: IRoom[];
  tags: ITag[];
}

export interface ISession {
  id: UUID;
  type: ISessionType['id'];
  room: IRoom['id'];
  broadcast?: IRoom['id'][] | null;
  start: Date;
  end: Date;
  qa?: URL;
  slide?: URL;
  live?: URL;
  record?: URL;
  language?: string;
  zh?: ISessionContent;
  en?: ISessionContent;
  speakers: ISpeaker['id'][];
  tags?: string[];
}

export type UUID = string;

export type URL = string;

export interface ISessionType {
  id: string;
  zh?: IGeneralContent;
  en?: IGeneralContent;
}

export interface ISessionContent {
  title: string;
  description?: string;
}

export interface ISpeaker {
  id: UUID;
  avatar?: URL;
}

export interface IRoom {
  id: string;
  zh?: IGeneralContent;
  en?: IGeneralContent;
}

export interface ITag {
  id: string;
  zh?: IGeneralContent;
  en?: IGeneralContent;
}

export interface IGeneralContent {
  name: string;
  desctiption?: string;
}
