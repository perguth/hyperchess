var choo = require('choo')
var app = choo()

var reducers = require('./reducers')
var subscriptions = require('./subscriptions')
var effects = require('./effects')
var state = {}
var router = require('./router')

app.model({state, reducers, subscriptions, effects})
app.router(router)

var cooTree = app.start()
var ChooChooProto = Object.create(HTMLElement.prototype)

ChooChooProto.createdCallback = function () {
  var shadow = this.createShadowRoot()
  shadow.appendChild(cooTree)
}

var ChooChoo = document.registerElement('choo-choo', {prototype: ChooChooProto})
var chooChooNode = new ChooChoo()

document.body.appendChild(chooChooNode)
