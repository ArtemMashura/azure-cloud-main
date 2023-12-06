const { TableClient } = require("@azure/data-tables");
const { v1: uuidv1 } = require("uuid");
const { v4: uuidv4 } = require("uuid");
const updateEntity = require('./innerFunctions/updateEntity');

const handleAddGood = async (req, res) => {
    const { categoryName, goodVisibleName, price, imageBase64, fileRes } = req.body;
    
    try {
        const blobName = 'image_' + uuidv1() + '.' + fileRes;
        var test = imageBase64.split(',')

        var urlData = await updateEntity.changeThumbnailAndPreview(test[1], fileRes, blobName)
        thumbnailURL = urlData[0]
        previewURL = urlData[1]

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