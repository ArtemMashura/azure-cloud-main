const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");

const handleAddThumbnail = async (req, res) => {
    const {imageBase64, fileRes} = req.body
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

        
        
        const uploadBlobResponse = await blockBlobClient.upload(buf, buf.length);
        console.log(
        `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
        );
        res.status(201).json({'success': `New blob ${blobName} created at url ${blockBlobClient.url}`})

        
    } catch (err){
        console.log(err)
        res.status(409).json({"error": err})
    }
}

module.exports = {handleAddThumbnail}