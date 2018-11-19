// @flow

import colors from 'colors'

import type { MultipleLintingResults } from 'engine'

export default function (results: MultipleLintingResults): string {
    let output = ''

    let errorsCount = 0
    let warningsCount = 0

    for(const sourceFile in results) {
        if(results[sourceFile].length === 0) continue
        output += `${colors.underline(sourceFile)}\n`

        for(const issue of results[sourceFile]) {
            const codePoint = colors.gray(`${issue.line}:${issue.col}`)
            let type = issue.type
            switch(issue.type) {
            case 'error': type = colors.red(type); errorsCount++; break
            case 'warn': type = colors.yellow(type); warningsCount++; break
            }
            output += `  ${codePoint}   ${type}  ${issue.msg}  ${colors.gray(issue.rule)}\n`
        }
    }
    const sign = errorsCount > 0 ? '✖' : '✓'
    let result = `\n${sign} ${errorsCount + warningsCount} issues (${errorsCount} errors; ${warningsCount} warnings)`
    if(errorsCount > 0) {
        result = colors.red(result)
    } else if(warningsCount > 0) {
        result = colors.yellow(result)
    } else {
        result = colors.green(result)
    }
    output += result
    return output
}
