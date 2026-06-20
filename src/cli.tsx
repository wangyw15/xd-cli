import { render } from 'ink';
import meow from 'meow';
import App from '@/app';

const cli = meow(
  `
  Usage
    $ xd-cli

  Examples
    $ xd-cli
`,
  {
    importMeta: import.meta,
  },
);

await Bun.stdout.write('\u{1B}[?1049h');
render(<App />);
