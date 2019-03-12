var jokes = require('./jokes.js')
var si = require('systeminformation');
var blessed = require('blessed')
, contrib = require('blessed-contrib')
, screen = blessed.screen()

var grid = new contrib.grid({rows: 2, cols: 2, screen: screen})

var MemDonut = grid.set(1, 1, 1, 1, contrib.donut,
    {
    label: 'Memory Usage',
    radius: 10,
    arcWidth: 4,
    yPadding: 2,
  data: [
    {percent: 0, label: '', color: 'green'}
  ]
});

var CpuDonut = grid.set(0, 1, 1, 1, contrib.donut,
    {
    label: 'CPU Usage',
    radius: 10,
    arcWidth: 4,
    yPadding: 2,
  data: [
    {percent: 0, label: '', color: 'cyan'}
  ]
});

var pic = grid.set(1, 0, 1, 1, contrib.picture,
    { file: 'ubuntu.png'
    , cols: 22
    , onReady: ready})
function ready() {screen.render()}

var log = grid.set(0, 0, 1, 1, contrib.log,
    { fg: "green"
    , selectedFg: "green"
    , label: 'Server Log'}
)

screen.render();

setInterval(UpdateMemDonut, 50)
setInterval(UpdateCpuDonut, 50)
setInterval(UpdateLog, 2000)

var mem = 0.00;
var cpu = 0.00;

function UpdateMemDonut(){
    si.mem()
        .then(function(data) {
            total = data['total']
            used = data['used']
            mem = used/total
        }, function(error) {
            console.error(error)
        });

    MemDonut.update([
        {percent: parseFloat((mem) % 1).toFixed(2), label: '', 'color': 'green'},
    ])
    screen.render();
}

function UpdateCpuDonut(){
    si.currentLoad()
        .then(function(data) {
            cpu = data['currentload']
        }, function(error) {
            console.error(error)
        });

    CpuDonut.update([
        {percent: parseFloat(cpu).toFixed(2), label: '', 'color': 'cyan'},
    ])
    screen.render();
}

function UpdateLog(){
    log.log(jokes.get_joke());
    screen.render();
}

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	return process.exit(0);
});
