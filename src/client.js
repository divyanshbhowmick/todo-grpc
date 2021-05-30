const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const { TODO_PROTO_PATH } = require("./utils/constants");

// Defining the path for the package
const packageDef = protoLoader.loadSync(TODO_PROTO_PATH, {});
// Loading the package
const grpcObject = grpc.loadPackageDefinition(packageDef);
// Getting the todoPackage out of it
const todoPackage = grpcObject.todoPackage;

// Creating a client for todoPackage
const client = new todoPackage.Todo(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

// Reading the arguments from commandline
const text = process.argv[2];

// Making the POST request kinda thing
// client.createTodo(
//   {
//     id: -1,
//     text: text,
//   },
//   (err, resp) => {
//     if (!err)
//       console.log("Writing :: Response from Server" + JSON.stringify(resp));
//     else console.error("Writing :: ", err);
//   }
// );

// Making the getRequest kind of thing
// client.readTodos({}, (err, resp) => {
//   if (!err)
//     console.log("Reading :: Response from Serverrr" + JSON.stringify(resp));
//   else console.error("Reading :: ", err);
// });

// Creating a call object for reading the streams sent by server
const call = client.readTodosStream();

// on call.write() on server's end the data event is fired.. so read the stream
call.on("data", (item) => {
  console.log(
    "Stream :: Recieved stream from Server:  " + JSON.stringify(item)
  );
});

// on call.end() on server's end end event is fired so the stream is finshed
call.on("end", (e) => console.log("Stream :: Done fetching the stream!"));
