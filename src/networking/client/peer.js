var BaseClient = require('./base'),
	util = require('util'),
	config = require('../../../data/config');

var PeerClient = module.exports = function(){

};

util.inherits(PeerClient, BaseClient);

PeerClient.prototype.adapter_type = 'peerjs client';

PeerClient.prototype.connect = function(server_id) {
	var self = this;
	this.peer = new Peer({key: config.PEERJS_KEY});
	var conn = this.conn = this.peer.connect(server_id);
	this.log('trying to connect..', server_id);
	conn.on('open', function(){
		self.log('connected!');
		self.emit('connected');
	});

	conn.on('close', function(){
		self.log('disconnected!');
		self.emit('disconnected');
	});

	conn.on('data', function(data){
		self.log('data', data);
		self.emit('message', data.m, data.d);
	});

	conn.on('error', function(err){
		self.log('error', err);
	});
};

PeerClient.prototype.send = function(msg, data){
	this.conn.send(this.fmt_message(msg, data));
};

PeerClient.prototype.disconnect = function(){
	this.conn.disconnect();
};