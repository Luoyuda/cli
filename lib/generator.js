const { getRepoList, getTagList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const path = require('path')
const downloadGitRepo = require('download-git-repo')

async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message)
  spinner.start()
  try {
    const result = await fn(...args)
    spinner.succeed()
    return result
  } catch (error) {
    spinner.fail('Request failed, refetch')
  }
}

class Generator {
  constructor(name, target) {
    this.name = name
    this.target = target
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }
  async getTag(repo) {
    const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo)
    if (!tags) return
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tags.map((tag) => tag.name),
      message: 'choose a tag to create project',
    })
    return tag
  }
  async getRepo() {
    const repoList = await wrapLoading(getRepoList, 'waiting fetch repo')
    if (!repoList) return
    const repos = repoList.map((repo) => repo.name)
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'choose a template to create project',
    })
    return repo
  }
  async download(repo, tag) {
    const requestUrl = `zhurong-cli/${repo}${tag ? '#' + tag : ''}`
    await wrapLoading(
      this.downloadGitRepo,
      'waiting download template',
      requestUrl,
      path.resolve(process.cwd(), this.target)
    )
  }
  async create() {
    console.log(`create-${this.name} this.target ${this.target}`)
    const repo = await this.getRepo()
    const tag = await this.getTag(repo)
    await this.download(repo, tag)
  }
}

module.exports = Generator
