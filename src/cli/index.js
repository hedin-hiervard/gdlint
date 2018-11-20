#!/usr/bin/env node
// @flow
import dotenv from 'dotenv'
import Youch from 'youch'
import forTerminal from 'youch-terminal'
import log from 'log.js'
import program from 'commander'
import fs from 'fs-extra'
import glob from 'glob-promise'
import path from 'path'

import Engine from 'engine'
import format from 'formatters/colored-console'

import type { MultipleLintingResults } from 'engine'

process.on('unhandledRejection', err => {
    throw err
})

process.on('uncaughtException', err => {
    new Youch(err, {})
        .toJSON()
        .then((output) => {
            log.error(forTerminal(output))
        })
})

dotenv.config()

program
    .arguments('<source-file[s]> <ast-file[s]>')
    .action(async(sourceFilesGlob: string, astFilesGlob: string) => {
        const engine = new Engine()
        const sourceFiles = glob.sync(sourceFilesGlob)
        const astFiles = glob.sync(astFilesGlob)

        const results: MultipleLintingResults = {}

        let errorsCount = 0
        for(const sourceFile of sourceFiles) {
            const source = fs.readFileSync(sourceFile, 'utf-8')
            let foundAST = false
            const { base } = path.parse(sourceFile)
            for(const astFile of astFiles) {
                const astName = path.parse(astFile).name
                if(astName === base) {
                    foundAST = true
                    const ast = JSON.parse(fs.readFileSync(astFile, 'utf-8'))
                    results[sourceFile] = await engine.lint(source, ast)
                    errorsCount += results[sourceFile]
                        .reduce((acc, issue) => acc + (issue.type === 'error' ? 1 : 0), 0)
                    break
                }
            }
            if(!foundAST) {
                log.error(`couldn't find AST file for ${sourceFile}`)
                process.exit(1)
            }
        }

        console.log(format(results)) // eslint-disable-line no-console
        process.exit(errorsCount === 0 ? 0 : 1)
    })

if(process.argv.length < 3) {
    program.help()
    process.exit(0)
}

program.parse(process.argv)
