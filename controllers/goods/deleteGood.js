const { TableClient } = require("@azure/data-tables");
const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");

const handleDeleteGood = async (req, res) => {
    console.log(1)
    const {goodName, categoryName, goodVisibleName, price, imageBase64, fileRes } = req.body;
    if (!goodVisibleName){
        goodVisibleName = goodName;
    }
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            process.env.AZURE_STORAGE_BLOB_CONNECTION_STRING
        );
        const containerClient = blobServiceClient.getContainerClient("test");
        const blobName = 'image_' + uuidv1() + '.' + fileRes;

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        

        
        
        const uploadBlobResponse = await blockBlobClient.upload(buf, buf.length);
        console.log(
        `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
        );

            
        
        const tableClient = TableClient.fromConnectionString(process.env.connString, "goods", { allowInsecureConnection: true } );
        const task = {
            partitionKey: "Item",
            rowKey: goodName,
            category: categoryName,
            visibleName: goodVisibleName,
            price: price,
            thumbnailURL: thumbnailURL
        };
        await tableClient.createEntity(task);
        res.status(201).json({'success': `New good ${goodName} created`})
    } catch (err){
        console.log(err)
        res.status(404).json({"error": err})
    }
}

module.exports = {handleDeleteGood}