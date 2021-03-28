const request = require('request');
const { auth, myId, slaveGuard, slaveStealer, slaveFinder, slaveUpgrader, slaveNotifier, userAgent } = require('./config.json');

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

Array.prototype.remove = function (val) {
    for (var i = 0; i < this.length; i++) 
        if (this[i] == val) {
            this.splice(i, 1);
            i--;
        }
    return this;
}

const origin = "https://prod-app7794757-c1ffb3285f12.pages-ac.vk-apps.com";

var jobSlave = (id, job) => {
    request.post({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/jobSlave', json: { 'slave_id': id, 'name': job }, headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
        if (err) return;
    });
}

var addSlave = (id, job) => {
    request.post({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/buySlave', json: { 'slave_id': id }, headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
        if (err) return;
        setTimeout(() => {
            jobSlave(id, job);
        }, 500);
    });
}

var buyFetter = (id) => {
    request.post({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/buyFetter', json: { 'slave_id': id }, headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
        if (err) return;
    });
}

var saleSlave = (id) => {
    request.post({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/saleSlave', json: { 'slave_id': id }, headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
        if (err) return;
    });
}

var moneyLeft = 0;
var profitPerMinute = 0;
var actualSlaveCount = 0;

var allowedEscapists = [];

if (slaveGuard.enabled) {
    var slaveDataLast = [];
    setInterval(() => {
        try {
            request.get({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/start', headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
                if (err) return;
                if (body.startsWith('<html>')) return; // 5xx server error handling (unusual, damn stupid way)
                body = JSON.parse(body);

                moneyLeft = body.me.balance;

                profitPerMinute = 0;
                actualSlaveCount = 0;

                const slaveIdsParsed = [];
                body.slaves.forEach(slave => {
                    profitPerMinute += slave.profit_per_min;
                    actualSlaveCount++;
                    slaveIdsParsed.push(slave.id);
                });

                if (slaveDataLast == null)
                    notSlaves = [];
                else notSlaves = slaveDataLast.filter((el) => {
                    return !slaveIdsParsed.includes(el);
                });

                var id = 0;
                notSlaves.forEach(slave => {
                    if (allowedEscapists.includes(slave))
                        console.log(`${slave} \x1b[32m(allowed) \x1b[36m[slaveGuard]\x1b[0m`);
                    else
                        setTimeout(() => {
                            request.get({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/user?id=' + slave, headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
                                if (err) return;
                                if (body.startsWith('<html>')) return;
                                body = JSON.parse(body);

                                console.log(`${slave} -> ${body.master_id} \x1b[36m[slaveGuard]\x1b[0m`);
                                addSlave(slave, slaveGuard.jobs.random());
                                setTimeout(() => {
                                    buyFetter(slave);
                                }, 1000);
                            });
                        }, 1000 * id++);
                });
                slaveDataLast = slaveIdsParsed;
            });
        }
        catch { }
    }, 1000);
} else {
    setInterval(() => {
        try {
            request.get({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/start', headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
                if (err) return;
                if (body.startsWith('<html>')) return; // 5xx server error handling (unusual, damn stupid way)
                body = JSON.parse(body);

                moneyLeft = body.me.balance;

                profitPerMinute = 0;
                actualSlaveCount = 0;

                body.slaves.forEach(slave => {
                    profitPerMinute += slave.profit_per_min;
                    actualSlaveCount++;
                });
            });
        }
        catch { }
    }, 1000);
}

if (slaveStealer.enabled) {
    var id = 0;
    slaveStealer.targets.forEach(attackId => {
        setTimeout(() => {
            setInterval(() => {
                if (moneyLeft < slaveStealer.moneyLimit)
                    return;
                try {
                    request.get({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/slaveList?id=' + attackId, headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
                        if (err) return;
                        if (body.startsWith('<html>')) return;
                        body = JSON.parse(body);
                        var slave = body.slaves.filter(e => e.fetter_to <= 0).random();
                        if (slave == null) return;
                        addSlave(slave.id, slaveStealer.jobs.random());
                        console.log(`${myId} <- ${slave.id} <- ${attackId} \x1b[31m[slaveStealer]\x1b[0m`);
                    });
                }
                catch { }
            }, 5000);
        }, 1000 * id++);
    });
}

if (slaveUpgrader.enabled) {
    setInterval(() => {
        if (moneyLeft < slaveUpgrader.moneyLimit)
            return;
        try {
            request.get({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/start', headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
                if (err) { console.log(err); return; }
                if (body.startsWith('<html>')) return;
                body = JSON.parse(body);

                var slave = body.slaves.filter(e => e.fetter_to <= 0 && e.profit_per_min < 1000 && e.profit_per_min != 0 && e.job.name != '').random();
                if (slave == null) return;
                allowedEscapists.push(slave.id);
                saleSlave(slave.id);
                setTimeout(() => {
                    addSlave(slave.id, slaveUpgrader.jobs.random());
                    setTimeout(() => {
                        allowedEscapists = allowedEscapists.remove(slave.id);
                    }, 10000);
                }, 5000);
                console.log(`${slave.id} -/-> \x1b[33m[slaveUpgrader]\x1b[0m`)
            });
        }
        catch { }
    }, 5000);
}

const getRandomInt = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);

var hasSearchEnded = true;
if (slaveFinder.enabled) {
    setInterval(() => {
        if (moneyLeft < slaveFinder.moneyLimit || !hasSearchEnded)
            return;
        try {
            var ids = [];
            for (var i = 0; i < 100; i++)
                ids.push(getRandomInt(100, 999999999));
            request.post({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/user', json: { 'ids': ids }, headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
                if (err) return;

                hasSearchEnded = false;
                var id = 0
                body.users.forEach(slave => {
                    if (slave.price <= slaveFinder.filters.maxPrice &&
                        slave.price >= slaveFinder.filters.minPrice &&
                        slave.profit_per_min >= slaveFinder.filters.minProfit)
                        setTimeout(() => {
                            addSlave(slave.id, slaveFinder.jobs.random());
                            console.log(`${myId} <- ${slave.id} \x1b[35m[slaveFinder]\x1b[0m`);
                        }, 5000 * id++);
                });
                setTimeout(() => {
                    hasSearchEnded = true;
                }, 5000 * id);
            });
        }
        catch { }
    }, 5000);
}

if (slaveNotifier.enabled) {
    setInterval(() => {
        console.log(`ppm: ${profitPerMinute}, slaves: ${actualSlaveCount} \x1b[34m[slaveNotifier]\x1b[0m`);
    }, 10000);
}

console.log('slave-guard is running...');
