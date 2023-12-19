import * as commander from 'commander';
import { svg2Font } from './index';
import { readConfig } from 'unreadconfig';

const COLORS = {
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  console_color: '\x1b[0m',
} as const;

const colorConsoleText = (text: string, color: keyof typeof COLORS) => {
  const coloredText = `${COLORS[color]}${text}${COLORS.console_color}`;
  return console.log(coloredText);
};

const DEFAULT_FILE_NAME = 'svgtocss';

export async function startCli(cwd = process.cwd(), argv = process.argv) {
  try {
    commander.program.option('-c, --config <file_name>', 'File name config').parse(argv);
    const options = commander.program.opts();

    const FILE_NAME_CONFIG = options.config ?? DEFAULT_FILE_NAME;

    const optionsConfig = readConfig(FILE_NAME_CONFIG);

    if (JSON.stringify(optionsConfig) === '{}') {
      throw new Error('Not Found Config');
    }

    svg2Font({
      ...optionsConfig,
      website: {
        index: 'font-class',
        title: optionsConfig?.fontName || 'svgtocss',
        links: [
          {
            title: 'GitHub',
            url: 'https://github.com/hunghg255/svgtocss',
          },
        ],
      },
    });
  } catch (error: any) {
    colorConsoleText('❌ csvg-to-svg Error: ' + error.message, 'red');
  }
}
