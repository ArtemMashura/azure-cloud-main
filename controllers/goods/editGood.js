const { TableClient } = require("@azure/data-tables");
const { BlobServiceClient } = require("@azure/storage-blob");

const handleEditGood = async (req, res) => {
    const {goodName, categoryName, goodVisibleName, price, imageBase64, fileRes } = req.body;
    
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "goods", { allowInsecureConnection: true } );
        const task = {
            partitionKey: "Item",
            rowKey: goodName,
        };
        if (imageBase64 && fileRes){
            const blobServiceClient = BlobServiceClient.fromConnectionString(
                process.env.AZURE_STORAGE_BLOB_CONNECTION_STRING
            );
            const containerClient = blobServiceClient.getContainerClient("test");

            

            let data = await tableClient.getEntity("Item", goodName)

            const blobName = data.thumbnailName
    
            // Get a block blob client
    
            // Get a block blob client
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
            // Display blob name and url
            console.log(
            `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
            );            
            var test = imageBase64.split(',')
    
            
            var buf = Buffer.from(test[1], 'base64')
    
            const blobOptions = { blobHTTPHeaders: { blobContentType: `image/${fileRes}` } };
            
            const uploadBlobResponse = await blockBlobClient.upload(buf, buf.length, blobOptions);
            console.log(
            `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
            );
            // task.thumbnailURL = blockBlobClient.url
            // task.thumbnailName = blobName
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
        
        await tableClient.updateEntity(task, "Merge");
        res.status(201).json({'success': `Good ${goodName} updated`})
    } catch (err){
        console.log(err)
        res.status(404).json({"error": err})
    }
}

module.exports = {handleEditGood}