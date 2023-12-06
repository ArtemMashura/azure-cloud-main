const { TableClient } = require("@azure/data-tables");
const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
const { v4: uuidv4 } = require("uuid");
const Jimp = require('jimp');

const handleAddGood = async (req, res) => {
    const { categoryName, goodVisibleName, price, imageBase64, fileRes } = req.body;
    
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            process.env.AZURE_STORAGE_BLOB_CONNECTION_STRING
        );
        const containerClient = blobServiceClient.getContainerClient("test");
        const blobName = 'image_' + uuidv1() + '.' + fileRes;

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

        var thumbnailURL = blockBlobClient.url
        
        const image = await Jimp.create(buf)
        image.resize(64,64, function(err){
            if (err) throw err;
        })

        const previewBuf = await image.getBufferAsync(`image/${fileRes}`)

        const previewContainerClient = blobServiceClient.getContainerClient("thumbnails");

        // Get a block blob client
        const previesBlockBlobClient = previewContainerClient.getBlockBlobClient(blobName);
        const previewUploadBlobResponse = await previesBlockBlobClient.upload(previewBuf, previewBuf.length, blobOptions);

        var previewURL = previesBlockBlobClient.url

            
        
        const tableClient = TableClient.fromConnectionString(process.env.connString, "goods", { allowInsecureConnection: true } );
        let goodName = uuidv4();
        const task = {
            partitionKey: "Item",
            rowKey: goodName,
            category: categoryName,
            visibleName: goodVisibleName,
            price: price,
            thumbnailName: blobName,
            thumbnailURL: thumbnailURL,
            previewName: blobName,
            previewURL: previewURL
        };
        await tableClient.createEntity(task);
        res.status(201).json({'success': `New good ${goodName} created`})
    } catch (err){
        console.log(err)
        res.status(404).json({"error": err})
    }
}

module.exports = {handleAddGood}