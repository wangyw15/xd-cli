export type Cookie = {
  name: string;
  cookie: string;
};

export type Configuration = {
  cookie: string;
  feed_uuid: string;
  tips: boolean;
  cookies: Cookie[];
};

export const DEFAULT_CONFIG: Configuration = {
  cookie: '',
  feed_uuid: '',
  tips: true,
  cookies: [],
};

export async function loadConfig(
  filePath = 'config.toml',
): Promise<Configuration> {
  const configFile = Bun.file(filePath);
  if (!(await configFile.exists())) {
    throw new Error(`${filePath} not found.`);
  }

  const config = Bun.TOML.parse(await configFile.text()) as Configuration;
  return { ...DEFAULT_CONFIG, ...config };
}

export function getCookie(
  config: Configuration,
  name?: string,
): Cookie | undefined {
  const target = name ?? config.cookie;
  return config.cookies.find((cookie) => cookie.name === target);
}
