const choo = require('choo')
const app = choo()

const model = {
  state: {
  },
  reducers: require('./reducers'),
  subscriptions: require('./subscriptions')({}, hyperlog),
  effects: require('./effects')
}

app.model(model)

const streamView = require('./view.js')

app.router((route) => [
  route('/', streamView)
])

const tree = app.start()
document.body.appendChild(tree)
