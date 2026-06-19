import { render } from 'ink';
import meow from 'meow';
import App from '@/app';

const cli = meow(
  `
  Usage
    $ xd-cli

  Options
    --name  Your name

  Examples
    $ xd-cli --name=Jane
    Hello, Jane
`,
  {
    importMeta: import.meta,
    flags: {
      name: {
        type: 'string',
      },
    },
  },
);

process.stdout.write('\x1b[?1049h');
render(<App />);
