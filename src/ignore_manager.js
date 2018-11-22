// @flow

import fs from 'fs'
import path from 'path'
import glob from 'glob-promise'

export default class IgnoreManager {
    ignores: Array<string>;

    constructor(cwd: string) {
        this.ignores = []
        const dirs = path.parse(cwd).dir.split(path.sep)
        while(dirs.length > 0) {
            const ignoreFilePath = dirs.join(path.sep)
            const ignoreFile = path.join(ignoreFilePath, '.gdlintignore')
            if(fs.existsSync(ignoreFile)) {
                const result = fs.readFileSync(ignoreFile, 'utf-8')
                    .split('\n')

                for(const line of result) {
                    if(line.trim() === '') continue
                    const pattern = path.join(ignoreFilePath, line)
                    this.ignores.push(...glob.sync(pattern))
                }
                return
            }
            dirs.pop()
        }
    }

    isIgnored(filepath: string): boolean {
        return this.ignores.includes(filepath)
    }
}
