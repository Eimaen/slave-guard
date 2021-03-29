const request = require('request');
const { auth, myId, defaultJobs, userAgent } = require('./config.json');
var { slaveGuard, slaveStealer, slaveFinder, slaveUpgrader, slaveNotifier, slaveJobGiver } = require('./config.json');

if (slaveGuard.jobs.length == 0) slaveGuard.jobs = defaultJobs;
if (slaveStealer.jobs.length == 0) slaveStealer.jobs = defaultJobs;
if (slaveFinder.jobs.length == 0) slaveFinder.jobs = defaultJobs;
if (slaveUpgrader.jobs.length == 0) slaveUpgrader.jobs = defaultJobs;
if (slaveJobGiver.jobs.length == 0) slaveJobGiver.jobs = defaultJobs;

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

const getRandomInt = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);

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
        }, getRandomInt(500, 2000));
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

                var id = 1;
                notSlaves.forEach(slave => {
                    if (allowedEscapists.includes(slave))
                        console.log(`${slave} \x1b[32m(allowed) \x1b[36m[slaveGuard]\x1b[0m`);
                    else
                        setTimeout(() => {
                            request.get({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/user?id=' + slave, headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
                                if (err) return;
                                if (body.startsWith('<html>')) return;
                                body = JSON.parse(body);

                                if (body.master_id == myId)
                                    console.log(`${slave} \x1b[32m(re-purchase) \x1b[36m[slaveGuard]\x1b[0m`);
                                else {
                                    console.log(`${slave} -> ${body.master_id} \x1b[36m[slaveGuard]\x1b[0m`);
                                    addSlave(slave, slaveGuard.jobs.random());
                                    if (slaveGuard.fetter)
                                        setTimeout(() => {
                                            buyFetter(slave);
                                        }, getRandomInt(500, 2000));
                                }
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
    var id = 1;
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

                var slave = body.slaves.filter(e => e.profit_per_min < 1000 && e.profit_per_min != 0 && e.job.name != '').random();
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

var hasSearchEnded = true;
if (slaveFinder.enabled) {
    setInterval(() => {
        if (moneyLeft < slaveFinder.moneyLimit || !hasSearchEnded)
            return;
        hasSearchEnded = false;
        // console.log(`started \x1b[35m[slaveFinder]\x1b[0m`);
        try {
            var ids = [];
            for (var i = 0; i < 100; i++)
                ids.push(getRandomInt(100, 999999999));
            request.post({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/user', json: { 'ids': ids }, headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
                if (err) return;
                if (body.error != null) return;
                if (body.users == null) return;

                try {
                    var id = 1;
                    body.users.filter(e => e.price <= slaveFinder.filters.maxPrice && e.price >= slaveFinder.filters.minPrice && e.profit_per_min >= slaveFinder.filters.minProfit && e.fetter_to == 0).forEach(slave => {
                        setTimeout(() => {
                            addSlave(slave.id, slaveFinder.jobs.random());
                            console.log(`${myId} <- ${slave.id} \x1b[35m[slaveFinder]\x1b[0m`);
                        }, getRandomInt(4000, 6000) * id++);
                    });
                    setTimeout(() => {
                        hasSearchEnded = true;
                        // console.log(`finished \x1b[35m[slaveFinder]\x1b[0m`);
                    }, 6000 * id);
                }
                catch { hasSearchEnded = true; }

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

var hasJobsGivingEnded = true;
if (slaveJobGiver.enabled) {
    setInterval(() => {
        if (!hasJobsGivingEnded)
            return;
        hasJobsGivingEnded = false;
        // console.log(`starting \x1b[32m[slaveJobGiver]\x1b[0m`);
        request.get({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/start', headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
            if (err) return;
            if (body.startsWith('<html>')) return;
            body = JSON.parse(body);

            var id = 1;
            body.slaves.filter(e => e.job.name == '').forEach(slave => {
                setTimeout(() => {
                    jobSlave(slave.id, slaveJobGiver.jobs.random());
                    console.log(`${slave.id} <+> \x1b[32m[slaveJobGiver]\x1b[0m`);
                }, getRandomInt(2000, 4000) * id++);
            });
            setTimeout(() => {
                hasJobsGivingEnded = true;
                // console.log(`finished \x1b[32m[slaveJobGiver]\x1b[0m`);
            }, 4000 * id);
        });
    }, 60000);
}
console.log('slave-guard is running...');
