module.exports = [
  {
    type: "input",
    name: "projectName",
    message: "请输入项目名称",
    required: true,
    default: ''
  },
  {
    type: "input",
    name: "description",
    message: "请输入项目简介",
    default: ''
  },
  {
    type: "input",
    name: "author",
    message: "请输入作者名称",
    default: ''
  },
  {
    type: "list",
    name: "template",
    message: "选择其中一个作为项目模版",
    choices: ['ts-vue (vue+ts项目模版)'],
    default: 0
  }
]
