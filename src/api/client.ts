import type {
  AddFeedResult,
  CDNPath,
  DelFeedResult,
  FeedThread,
  Forum,
  ForumThread,
  LastPost,
  Notice,
  PostThreadOptions,
  Ref,
  ReplyThreadOptions,
  Thread,
  Timeline,
} from './types';

export type ClientOptions = {
  baseURL?: string;
  userhash?: string;
};

type QueryParameters = Record<string, string | number | boolean | undefined>;
type FormBody = Record<string, string | number | boolean | undefined>;

const DEFAULT_BASE_URL = 'https://api.nmb.best/api/';
const MAIN_SITE_URL = 'https://www.nmbxd.com/';
const NOTICE_URL = 'https://nmb.ovear.info/nmb-notice.json';
const COVER_URL = 'https://nmb.ovear.info/h.php';

export class NmbxdClient {
  private readonly baseUrl: string;
  private userhash?: string;

  constructor(options: ClientOptions = {}) {
    this.baseUrl = options.baseURL ?? DEFAULT_BASE_URL;
    this.userhash = options.userhash;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {};
    if (this.userhash !== undefined && this.userhash !== '') {
      headers.Cookie = `userhash=${this.userhash}`;
    }

    return headers;
  }

  private buildUrl(path: string, parameters?: QueryParameters): URL {
    const url = new URL(path, this.baseUrl);
    if (parameters) {
      for (const [key, value] of Object.entries(parameters)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url;
  }

  private async get<T>(path: string, parameters?: QueryParameters): Promise<T> {
    const response = await fetch(this.buildUrl(path, parameters), {
      headers: this.getHeaders(),
    });
    return response.json() as Promise<T>;
  }

  private async post<T>(path: string, body?: FormBody): Promise<T> {
    const entries = body
      ? Object.entries(body).filter(
          ([, value]) => value !== undefined && value !== null,
        )
      : [];
    const response = await fetch(this.buildUrl(path), {
      method: 'POST',
      headers: this.getHeaders(),
      body: new URLSearchParams(
        entries.map(([key, value]) => [key, String(value)]),
      ),
    });
    return response.json() as Promise<T>;
  }

  private buildFormData(
    options: PostThreadOptions | ReplyThreadOptions,
  ): FormData {
    const form = new FormData();
    form.set('name', options.name ?? '');
    form.set('title', options.title ?? '');
    form.set('content', options.content);
    if ('fid' in options) {
      form.set('fid', String(options.fid));
    } else {
      form.set('resto', String(options.resto));
    }

    if (options.water !== undefined) {
      form.set('water', options.water ? 'true' : '');
    }

    if (options.image) {
      form.set('image', options.image);
    }

    return form;
  }

  setUserhash(userhash: string | undefined): void {
    this.userhash = userhash;
  }

  async getCDNPath(): Promise<CDNPath[]> {
    return this.get<CDNPath[]>('getCDNPath');
  }

  async getForumList(): Promise<Forum[]> {
    return this.get<Forum[]>('getForumList');
  }

  async getTimelineList(): Promise<Timeline[]> {
    return this.get<Timeline[]>('getTimelineList');
  }

  async showf(id: number, page?: number): Promise<ForumThread[]> {
    return this.get<ForumThread[]>('showf', { id, page });
  }

  async getTimeline(id: number, page?: number): Promise<ForumThread[]> {
    return this.get<ForumThread[]>('timeline', { id, page });
  }

  async getThread(id: number, page?: number): Promise<Thread> {
    return this.get<Thread>('thread', { id, page });
  }

  async getPo(id: number, page?: number): Promise<Thread> {
    return this.get<Thread>('po', { id, page });
  }

  async getRef(id: number): Promise<Ref> {
    return this.get<Ref>('ref', { id });
  }

  async getFeed(uuid: string, page?: number): Promise<FeedThread[]> {
    return this.get<FeedThread[]>('feed', { uuid, page });
  }

  async addFeed(uuid: string, tid: number): Promise<AddFeedResult> {
    return this.post<AddFeedResult>('addFeed', { uuid, tid });
  }

  async delFeed(uuid: string, tid: number): Promise<DelFeedResult> {
    return this.post<DelFeedResult>('delFeed', { uuid, tid });
  }

  async getLastPost(): Promise<LastPost> {
    return this.get<LastPost>('getLastPost');
  }

  async getNotice(): Promise<Notice> {
    const response = await fetch(NOTICE_URL, { headers: this.getHeaders() });
    return response.json() as Promise<Notice>;
  }

  async getRandomCover(): Promise<string> {
    const response = await fetch(COVER_URL, {
      method: 'GET',
      headers: this.getHeaders(),
      redirect: 'manual',
    });
    const location = response.headers.get('location');
    if (location === null) {
      throw new Error('No redirect location found');
    }

    return new URL(location, COVER_URL).href;
  }

  async postThread(options: PostThreadOptions): Promise<string> {
    const url = new URL('home/forum/doPostThread.html', MAIN_SITE_URL);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: this.buildFormData(options),
    });
    return response.text();
  }

  async replyThread(options: ReplyThreadOptions): Promise<string> {
    const url = new URL('home/forum/doReplyThread.html', MAIN_SITE_URL);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: this.buildFormData(options),
    });
    return response.text();
  }
}
