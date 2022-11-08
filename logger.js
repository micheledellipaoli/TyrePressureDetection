var amqp = require('amqplib');

amqp.connect('amqp://guest:guest@127.0.1.1:5672').then(function(conn) {
	process.once('SIGINT', function() { conn.close(); });
	return conn.createChannel().then(function(ch) {
		var ok = ch.assertQueue('iot/tyre/logs', {durable: false});
		ok = ok.then(function(_qok) {
			return ch.consume('iot/tyre/logs', function(msg) {
				console.log(" [x] Received '%s'", msg.content.toString());
			}, {noAck: true});
		});
		return ok.then(function(_consumeOk) {
			console.log(' [*] Waiting for messages. To exit press CTRL+C');
		});
	});
}).catch(console.warn);
