#! /usr/bin/env node
const program = require('commander')
const create = require('../lib/create')
const figlet = require('figlet')
const chalk = require('chalk')

program
  // 版本号
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')
  .command('create <app-name>')
  .description('Create a new project')
  .option('-f, --force', 'overwrite target directory if it already exists')
  .action((name, options) => {
    create(name, options)
  })
program.on('--help', () => {
  console.log(
    '\r\n' +
      figlet.textSync('xiayu', {
        font: 'Ghost',
        width: 80,
        horizontalLayout: 'default',
        verticalLayout: 'default',
        whitespaceBreak: true,
      })
  )
  console.log(`\r\nRun ${chalk.green(`roc <command> --help`)} show details\r\n`)
})
// 解析命令
program.parse(process.argv)
