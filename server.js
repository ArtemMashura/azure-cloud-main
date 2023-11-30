require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3500;

app.use(express.json({limit: '50mb'}));

app.use('/categories', require('./routes/categories'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const connString = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"
// const tableService = TableServiceClient.fromConnectionString(connString, { allowInsecureConnection: true });


// const tableClient = TableClient.fromConnectionString(connString, "test", { allowInsecureConnection: true } );

// const task = {
//     partitionKey: "hometasks",
//     rowKey: "3",
//     description: "take out the trash",
//     dueDate: new Date(2015, 6, 20)
// };


// createEnt(task).then(res => {
//     console.log(res)
// })

// upsertEnt(task)

// const task1 = {
//     partitionKey: "hometasks",
//     rowKey: "1",
//     description: "Take out the trash",
//     dueDate: new Date(2015, 6, 20)
// };
// const task2 = {
//     partitionKey: "hometasks",
//     rowKey: "2",
//     description: "Wash the dishes",
//     dueDate: new Date(2015, 6, 20)
// };
  
// const tableActions = [
//     ["create", task1],
//     ["create", task2]
// ];

// // batchOperations(tableActions)

// async function createTab(){
//     await tableService.createTable('testFromCode');
// }

// async function createEnt(task){
//     let result = await tableClient.createEntity(task);
//     return result
// }

// async function upsertEnt(task){
//     let result = await tableClient.updateEntity(task, "Replace");
//     return result
// }

// async function batchOperations(tableActions){
//     let result = await tableClient.submitTransaction(tableActions);
//     return result
// }

// async function findEnt(partitionKey, rowKey){
//     try{
//         let result = await tableClient.getEntity(partitionKey, rowKey)
//         return result;
//     }
//     catch (error) {
//         console.log(result)
//         return "error"
//     };
    
// }

// async function batchOperations(tableActions){
//     let result = await tableClient.submitTransaction(tableActions);
//     return result
// }