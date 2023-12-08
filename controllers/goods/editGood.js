const { TableClient } = require("@azure/data-tables");
const { QueueClient } = require("@azure/storage-queue");

const handleEditGood = async (req, res) => {
    const {goodName, categoryName, goodVisibleName, price, imageBase64, fileRes } = req.body;
    
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "goods", { allowInsecureConnection: true } );
        const task = {
            partitionKey: "Item",
            rowKey: goodName,
        };
        if (imageBase64 && fileRes){
            const queueName = "pending-thumbnails";
            const queueClient = new QueueClient(process.env.AZURE_STORAGE_QUEUE_CONNECTION_STRING, queueName);

            var test = imageBase64.split(',')

            let data = await tableClient.getEntity("Item", goodName)
            const blobName = data.thumbnailName

            const queueData = JSON.stringify([test[1], fileRes, blobName, goodName])
            var queueSendMessage = await queueClient.sendMessage(queueData);

        }
        

            
        
        
        if (categoryName){
            task.category = categoryName
        }
        if (goodVisibleName){
            task.visibleName = goodVisibleName
        }
        if (price){
            task.price = price
        }
        
        let updateResult = await tableClient.updateEntity(task, "Merge");
        res.status(201).json({'result': updateResult, 'queueSendMessageResult': queueSendMessage})

    } catch (err){
        console.log(err)
        res.status(404).json({"error": err})
    }
}

module.exports = {handleEditGood}