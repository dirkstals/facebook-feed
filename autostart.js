
var forever = require('forever-monitor');

var monitorProcess = new (forever.Monitor)(process.argv[1].replace('autostart.js','index.js'), { 
    minUptime: 10000,
    spinSleepTime: 15000
});

process.on('SIGTERM', function(code) {
    monitorProcess.stop();
});

monitorProcess.start();
