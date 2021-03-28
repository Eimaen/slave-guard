const request = require('request');
const { auth, myId, slaveGuard, slaveStealer, slaveFinder, slaveUpgrader, userAgent } = require('./config.json');

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
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

var moneyLeft = 0;

if (slaveGuard.enabled) {
    var slaveDataLast = [];
    setInterval(() => {
        try {
            request.get({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/start', headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
                if (err) return;
                if (body.startsWith('<html>')) return; // 5xx server error handling (unusual, damn stupid way)
                body = JSON.parse(body);

                moneyLeft = body.me.balance;

                const slaveIdsParsed = [];
                body.slaves.forEach(slave => {
                    slaveIdsParsed.push(slave.id);
                });

                if (slaveDataLast == null)
                    notSlaves = [];
                else notSlaves = slaveDataLast.filter((el) => {
                    return !slaveIdsParsed.includes(el);
                });
                var id = 0;
                notSlaves.forEach(slave => {
                    setTimeout(() => {
                        request.get({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/user?id=' + slave, headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
                            if (err) return;
                            if (body.startsWith('<html>')) return;
                            body = JSON.parse(body);
                            console.log(`${slave} -> ${body.master_id} [slaveGuard]`);
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
                        console.log(`${myId} <- ${slave.id} <- ${attackId} [slaveStealer]`);
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
            if (slaveDataLast.length == 0)
                return;
            request.get({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/slaveList?id=' + myId, headers: { 'User-Agent': userAgent, 'Authorization': auth, 'Origin': origin } }, (err, httpResponse, body) => {
                if (err) return;
                if (body.startsWith('<html>')) return;
                body = JSON.parse(body);
                var slave = body.slaves.filter(e => e.fetter_to <= 0 && e.profit_per_min < 1000 && e.profit_per_min != 0 && e.job.name != '').random();
                if (slave == null) return;
                saleSlave(slave.id);
                setTimeout(() => {
                    addSlave(slave.id, slaveUpgrader.jobs.random());
                }, 5000);
                console.log(`${slave.id} -/-> [slaveUpgrader]`)
            });
        }
        catch { }
    }, 5000);
}

const getRandomInt = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);

if (slaveFinder.enabled)
{
    setInterval(() => {
        if (moneyLeft < slaveFinder.moneyLimit)
            return;
        try {
            addSlave(getRandomInt(100, 999999999), slaveFinder.jobs.random());
            console.log(`${myId} <- ${slave.id} [slaveFinder]`);
        }
        catch { }
    }, 5000);
}

console.log('slave-guard is running...');