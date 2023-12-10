const { BlobServiceClient } = require("@azure/storage-blob");
const { TableClient } = require("@azure/data-tables");
const Jimp = require('jimp');


async function changeThumbnailAndPreview(imageBase64, fileRes, blobName){

    const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_BLOB_CONNECTION_STRING
    );
    const blobServiceClient1 = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_BLOB_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient("test");
    const previewContainerClient = blobServiceClient1.getContainerClient("thumbnails");
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const previewsBlockBlobClient = previewContainerClient.getBlockBlobClient(blobName);
    const blobOptions = { blobHTTPHeaders: { blobContentType: `image/${fileRes}` } };
    console.log(blobOptions)
                    
    var buf = Buffer.from(imageBase64, 'base64')
    const uploadBlobResponse = await blockBlobClient.upload(buf, buf.length, blobOptions);
    console.log(uploadBlobResponse)
    var thumbnailURL = blockBlobClient.url
    
    const image = await Jimp.create(buf)
    image.resize(64,64, function(err){
        if (err) throw err;
    })
    const previewBuf = await image.getBufferAsync(`image/${fileRes}`)
    const previewUploadBlobResponse = await previewsBlockBlobClient.upload(previewBuf, previewBuf.length, blobOptions);
    console.log(previewUploadBlobResponse)
    var previewURL = previewsBlockBlobClient.url

    return [thumbnailURL, previewURL]
}

module.exports = {changeThumbnailAndPreview}