import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import patterns from './patterns.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const formatAll = () => {
    try {
        Object.keys(patterns).forEach((key) => {
            const pattern = patterns[key];
            if (!pattern) {
                return;
            }

            const target = join(root, key, pattern);

            console.log(`Formatting ${key} -> ${target}`);
            execSync(`npx prettier --write '${pattern}' --ignore-unknown`, {
                stdio: 'inherit',
                cwd: key,
            });
        });
    } catch (err) {
        console.error('Format error :', err);
        process.exit(1);
    }
};

formatAll();
