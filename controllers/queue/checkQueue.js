const { QueueClient } = require("@azure/storage-queue");
const { TableClient } = require("@azure/data-tables");
const updateEntity = require('../goods/innerFunctions/updateEntity');

async function handleConstantlyCheckQueue() {
    const queueName = "pending-thumbnails";
    
    // Instantiate a QueueClient which will be used to create and interact with a queue
    const queueClient = new QueueClient(process.env.AZURE_STORAGE_QUEUE_CONNECTION_STRING, queueName);
    const tableClient = TableClient.fromConnectionString(process.env.connString, "goods", { allowInsecureConnection: true } );

    while (true) {
        try {
            const peekedMessages = await queueClient.peekMessages();
            if (peekedMessages.peekedMessageItems.length > 0){
                const receivedMessagesResponse = await queueClient.receiveMessages();
                for (i = 0; i < receivedMessagesResponse.receivedMessageItems.length; i++) {
                    receivedMessage = receivedMessagesResponse.receivedMessageItems[i];
                    
                    let blobData = JSON.parse(receivedMessage.messageText)
                    let [imageBase64, fileRes, blobName, goodName] = blobData

                    var urlData = await updateEntity.changeThumbnailAndPreview(imageBase64, fileRes, blobName)
                    thumbnailURL = urlData[0]
                    previewURL = urlData[1]

                    const task = {
                        partitionKey: "Item",
                        rowKey: goodName,
                        thumbnailName: blobName,
                        thumbnailURL: thumbnailURL,
                        previewName: blobName,
                        previewURL: previewURL
                    };
                    await tableClient.updateEntity(task, "Merge");

                    // Delete the message
                    const deleteMessageResponse = await queueClient.deleteMessage(
                        receivedMessage.messageId,
                        receivedMessage.popReceipt
                    );
                    console.log("\tMessage deleted, requestId:", deleteMessageResponse.requestId);
                }
            }
        }
        catch (error) {
            console.log(error)
        }
    }
}

module.exports = {handleConstantlyCheckQueue}