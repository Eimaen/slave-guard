const request = require('request');
const { auth, job, userAgent } = require('./config.json');

var jobSlave = (id, job) => {
    request.post({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/jobSlave', json: { 'slave_id': id, 'name': job }, headers: { 'User-Agent': userAgent, 'Authorization': auth } }, (err, httpResponse, body) => {
        if (err) return;
    });
}

var addSlave = (id, job) => {
    request.post({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/buySlave', json: { 'slave_id': id }, headers: { 'User-Agent': userAgent, 'Authorization': auth } }, (err, httpResponse, body) => {
        if (err) return;
        setTimeout(() => {
            jobSlave(id, job);
        }, 1000);
    });
}

var buyFetter = (id) => {
    request.post({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/buyFetter', json: { 'slave_id': id }, headers: { 'User-Agent': userAgent, 'Authorization': auth } }, (err, httpResponse, body) => {
        if (err) return;
    });
}

var slaveDataLast = [];
setInterval(() => {
    try {
        request.get({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/start', headers: { 'User-Agent': userAgent, 'Authorization': auth } }, (err, httpResponse, body) => {
            if (err) return;
            if (body.startsWith('<html>')) return; // 5xx server error handling (unusual, damn stupid way)
            body = JSON.parse(body);

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
                    request.get({ url: 'https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/user?id=' + slave, headers: { 'User-Agent': userAgent, 'Authorization': auth } }, (err, httpResponse, body) => {
                        if (err) return;
                        if (body.startsWith('<html>')) return;
                        body = JSON.parse(body);
                        console.log(`${slave} -> ${body.master_id}`);
                        addSlave(slave, job);
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

console.log('slave-guard is running...');
