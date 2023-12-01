const { BlobServiceClient } = require("@azure/storage-blob");

const handleAddThumbnail = async (req, res) => {
    console.log(req.form)
    const {goodName, categoryName, goodVisibleName, price, thumbnailURL } = req.body;
    
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            process.env.AZURE_STORAGE_BLOB_CONNECTION_STRING
        );
        const containerClient = blobServiceClient.getContainerClient("test");
        const task = {
            partitionKey: "GoodsCategory",
            rowKey: goodName,
            category: categoryName,
            visibleName: goodVisibleName,
            price: price,
            thumbnailURL: thumbnailURL
        };
        await tableClient.createEntity(task);
        res.status(201).json({'success': `New category ${categoryName} created`})
    } catch (err){
        res.status(404).json({"error": err})
    }
}

module.exports = {handleAddThumbnail}