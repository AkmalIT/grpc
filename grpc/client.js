const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.resolve(__dirname, '../proto/todo.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;

const client = new todoProto.TodoService('localhost:50051', grpc.credentials.createInsecure());

module.exports = client;
