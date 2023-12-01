require('dotenv').config();
const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
const express = require('express');
const app = express();
const cors = require('cors');
const corsSettings = require('./config/corsSettings');
const path = require('path');

const PORT = process.env.PORT || 3500;

app.use(cors(corsSettings));


app.use(express.json({limit: '50mb'}));

app.use('/categories', require('./routes/categories'));
app.use('/adminpanel', require('./routes/adminpanel'));


const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_BLOB_CONNECTION_STRING
);

// createContainer()
// uploadTxtToBlob()
// listAll()
// downloadBlob()


async function createContainer(){
    const containerName = "test";

    console.log('\nCreating container...');
    console.log('\t', containerName);

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);
    // Create the container
    const createContainerResponse = await containerClient.create();
    console.log(
    `Container was created successfully.\n\trequestId:${createContainerResponse.requestId}\n\tURL: ${containerClient.url}`
    );
}

async function uploadTxtToBlob(){
    // Create a unique name for the blob
    const containerClient = blobServiceClient.getContainerClient("test");
    const blobName = 'test.png';

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Display blob name and url
    console.log(
    `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
    );

    // Upload data to the blob
    const data = 'Hello, World!';
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    console.log(
    `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
    );
}

async function listAll(){
    const containerClient = blobServiceClient.getContainerClient("test");
    console.log('\nListing blobs...');

    // List the blob(s) in the container.
    for await (const blob of containerClient.listBlobsFlat()) {
        // Get Blob Client from name, to get the URL
        const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);

        // Display blob name and URL
        console.log(
            `\n\tname: ${blob.name}\n\tURL: ${tempBlockBlobClient.url}\n`
        );
    }
}

async function downloadBlob(){
    const containerClient = blobServiceClient.getContainerClient("test");
    const blobName = 'quickstartdd2779c0-8fd2-11ee-b0c1-cfeec354c54f' + '.txt';

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    console.log('\nDownloaded blob content...');
    console.log(
        '\t',
        await streamToText(downloadBlockBlobResponse.readableStreamBody)
    );
}

async function streamToText(readable) {
    readable.setEncoding('utf8');
    let data = '';
    for await (const chunk of readable) {
      data += chunk;
    }
    return data;
  }

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