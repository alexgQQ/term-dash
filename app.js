var si = require('systeminformation');
var blessed = require('blessed')
, contrib = require('blessed-contrib')
, screen = blessed.screen()

var grid = new contrib.grid({rows: 2, cols: 2, screen: screen})

var donut = grid.set(1, 1, 1, 1, contrib.donut,
    {
    label: 'Memory',
    radius: 16,
    arcWidth: 4,
    yPadding: 2,
  data: [
    {percent: 80, label: 'USED RAM', color: 'green'}
  ]
});

var pic = grid.set(0, 1, 1, 1, contrib.picture,
    { file: 'rpi.png'
    , cols: 20
    , onReady: ready})
function ready() {screen.render()}

log = grid.set(0, 0, 1, 1, contrib.log,
    { fg: "green"
    , selectedFg: "green"
    , label: 'Server Log'})

screen.render();

setInterval(updateDonut, 50)
setInterval(updateLog, 500)

var foo = 0.00;

function updateDonut(){
    // si.mem()
    //     .then(function(data) {
    //         total = data['total']
    //         used = data['used']
    //         foo = used/total
    //     }, function(error) {
    //         console.error(error)
    //     });
    if (foo > 256) foo = 0;

    donut.update([
        {percent: parseFloat((foo/256) % 1).toFixed(2), label: 'USED RAM', 'color': [foo, foo, foo]},
    ])
    screen.render();
    foo += 1
}

function updateLog(){
    log.log('Foo bar!!')
}

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	return process.exit(0);
});
