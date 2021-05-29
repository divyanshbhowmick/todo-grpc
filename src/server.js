const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const { TODO_PROTO_PATH } = require("./utils/constants");

const packageDef = protoLoader.loadSync(TODO_PROTO_PATH, {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

// Creating a GRPC Server
const server = new grpc.Server();

// Configuring the server and binding the address and port to it.. and also allwoing insecure connections as
// by default it uses HTTP2 which requires ssl certificates
server.bind("0.0.0.0:40000", grpc.ServerCredentials.createInsecure());

// Adding the services to it... It behaves like controller
server.addService(todoPackage.Todo.service, {
  createTodo,
  readTodos,
  readTodosStream,
});

// Starting the server
server.start();

const todos = [];

function createTodo(call, callback) {
  console.log("::CREATING TODO::");
  const todoItem = {
    id: todos.length + 1,
    text: call.request.text,
  };
  todos.push(todoItem);
  // Calling the callback which will return the response.. first param is bytes of data, which it can aoutomatically compute
  callback(null, todoItem);
}

function readTodos(call, callback) {
  console.log("::READING TODOS::");
  // since we need to pass an array of todos we can pass it directly rather we need to follow the schema defined
  callback(null, { todos });
}

function readTodosStream(call, callback) {
  console.log("::READING AS A TODO STREAM::");
  todos.forEach((t) => call.write(t));
  call.end();
}
