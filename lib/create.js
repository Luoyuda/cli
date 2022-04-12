// const creator = new Creator()
const fs = require('fs-extra')
const path = require('path')
const Generator = require('./generator')
const inquirer = require('inquirer')
async function create(name, options) {
  // 获取当前命令行选择的目录
  const cwd = process.cwd()
  // 需要创建目录的目标地址
  const targetDir = path.join(cwd, name)
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite',
            },
            {
              name: 'Cancel',
              value: false,
            },
          ],
        },
      ])
      if (!action) return
      console.log(`\r\n Removing...`)
      await fs.remove(targetDir)
    }
  }
  const generator = new Generator(name, targetDir)

  generator.create()
}
module.exports = create
