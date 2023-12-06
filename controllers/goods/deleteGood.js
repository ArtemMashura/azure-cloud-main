const { TableClient } = require("@azure/data-tables");
const { BlobServiceClient } = require("@azure/storage-blob");

const handleDeleteGood = async (req, res) => {
    let deleteBlob = false;
    const {goodName} = req.body;
    if (req.body.deleteBlob === "true"){
        deleteBlob = true
    }
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "goods", { allowInsecureConnection: true } );
        if (deleteBlob === true) {
            const blobServiceClient = BlobServiceClient.fromConnectionString(
                process.env.AZURE_STORAGE_BLOB_CONNECTION_STRING
            );
            

            let data = await tableClient.getEntity("Item", goodName)

            const blobName = data.thumbnailName
            const previewBlobName = data.previewName

            const containerClient = blobServiceClient.getContainerClient("test");
            const thumbnailContainerClient = blobServiceClient.getContainerClient("thumbnails");

    
            // Get a block blob client
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const previewBlockBlobClient = thumbnailContainerClient.getBlockBlobClient(previewBlobName);

            
    
            const options = {
                deleteSnapshots: 'include' // or 'only'
            }
            
              
            const deleteBlobResponce = await blockBlobClient.delete(options);
            
            console.log(
            `Blob was deleted successfully. requestId: ${deleteBlobResponce.requestId}`
            );

            const deletePreviewBlobResponce = await previewBlockBlobClient.delete(options);
            
            console.log(
            `Blob was deleted successfully. requestId: ${deletePreviewBlobResponce.requestId}`
            );
        }
        var result = await tableClient.deleteEntity("Item", goodName);
        res.status(201).json({'success': `Good ${goodName} deleted`, "requestId": `${result.requestId}`})
    } catch (err){
        console.log(err)
        res.status(404).json({"error": err})
    }
}

module.exports = {handleDeleteGood}