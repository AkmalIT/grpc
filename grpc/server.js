const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { v4: uuidv4 } = require('uuid');

const PROTO_PATH = __dirname + '/../proto/todo.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const todoProto = grpc.loadPackageDefinition(packageDefinition).todo;

const todos = [];

const server = new grpc.Server();

server.addService(todoProto.TodoService.service, {
  AddTodo: (call, callback) => {
    const todo = { id: uuidv4(), ...call.request };
    todos.push(todo);
    callback(null, todo);
  },
  GetTodos: (call, callback) => {
    callback(null, { todos });
  },
  DeleteTodo: (call, callback) => {
    const index = todos.findIndex(todo => todo.id === call.request.id);
    if (index !== -1) {
      todos.splice(index, 1);
    }
    callback(null, {});
  }
});

const PORT = 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`gRPC server running at http://0.0.0.0:${PORT}`);
  server.start();
});
