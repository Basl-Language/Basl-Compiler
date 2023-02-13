import * as fs from 'fs';

export const openFile = (path: string): string => {
    return fs.readFileSync(path, 'utf8');
}
