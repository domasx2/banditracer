var Base = require('./base'),
	util = require('util'),
	config = require('../../../data/config');

var PeerServer = module.exports = function(max_clients, server_id){
	Base.apply(this, [max_clients]);
	this.server_id = server_id;
	this.clients = {};
};

util.inherits(PeerServer, Base);

PeerServer.prototype.adapter_type = 'peerjs server';

PeerServer.prototype.start = function() {
	var self = this;
	this.peer = new Peer(this.server_id, {key: config.PEERJS_KEY});
	this.peer.on('connection', function(conn){
		self.log('New connection');
		if(Object.keys(self.clients).length < self.max_clients){
			self.handleConnection(conn);
		} else {
			self.log('Connection dropped: max clients exceeded');
			conn.send(self.fmt_message('bye', {message: 'No space'}));
		}
	});
	this.log('Waiting for connection...');
};

PeerServer.prototype.handleConnection = function(conn){
	var client_id = this.newClientId();
	var self = this;
	this.clients[client_id] = conn;
	this.emit('connect', client_id);

	conn.on('data', function(data){
		self.handleData(client_id, data);
	});

	conn.on('error', function(error) {
		self.handleError(client_id, error);
	});

	conn.on('open', function() {
		self.handleOpen(client_id);
	});

	conn.on('close', function() {
		self.handleClose(client_id);
	});
};

PeerServer.prototype.send_raw = function(client_id, raw_data) {
	if(this.clients[client_id]) {
		if(this.clients[client_id].__open) {
			this.clients[client_id].send(raw_data);
		}
	} else {
		this.log(client_id, 'Conn not found!');
	}
}

PeerServer.prototype.send = function(client_id, message, data) {
	if(this.clients[client_id]) {
		if(this.clients[client_id].__open) {
			this.clients[client_id].send(this.fmt_message(message, data));
		}
	} else {
		this.log(client_id, 'Conn not found!');
	}
};

PeerServer.prototype.broadcast = function(message, data) {
	var raw_data = this.fmt_message(message, data);
	Object.keys(this.clients).forEach(function(id){
		this.send_raw(id, raw_data);
	}, this);
};

PeerServer.prototype.log = function(client_id, msg, data){
	Base.prototype.log.apply(this, ['['+client_id+']', msg, data]);
};
PeerServer.prototype.handleOpen = function(client_id) {
	this.clients[client_id].__open = true;
};

PeerServer.prototype.handleData = function(client_id, data){
	this.emit('message', client_id, data.m, data.d);
};

PeerServer.prototype.handleError = function(client_id, error) {
	this.log(client_id, 'error', error);
};

PeerServer.prototype.closeClient = function(client_id) {
	this.emit('disconnect', client_id);
	delete this.clients[client_id];
};

PeerServer.prototype.handleClose = function(client_id) {
	this.closeClient(client_id);
};


