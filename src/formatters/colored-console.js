// @flow

import colors from 'colors'

import type { MultipleLintingResults } from 'engine'

export default function (results: MultipleLintingResults): string {
    let output = ''

    for(const sourceFile in results) {
        if(results[sourceFile].length === 0) continue
        output += `${colors.underline(sourceFile)}\n`

        for(const issue of results[sourceFile]) {
            const codePoint = colors.gray(`${issue.line}:${issue.col}`)
            let type = issue.type
            switch(issue.type) {
            case 'error': type = colors.red(type); break
            case 'warn': type = colors.yellow(type); break
            }
            output += `  ${codePoint}   ${type}  ${issue.msg}  ${colors.gray(issue.rule)}\n`
        }
    }
    return output
}
