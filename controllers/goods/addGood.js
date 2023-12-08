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
            category: categoryName,         // тут би зробити перевірку на те що ця категорія існує, але я думаю це має зробити фронт-ендер на стороні адмін-панелі
            visibleName: goodVisibleName,   // і у цій панелі вибір категорії зробити як випадаючий список у якому компоненти ми беремо с беку методом вибору усіх елементів таблиці
            price: price,
            thumbnailName: blobName,
            thumbnailURL: thumbnailURL,
            previewName: blobName,
            previewURL: previewURL
        };
        let insertResult = await tableClient.createEntity(task);
        res.status(201).json({'result': insertResult, 'newGoodRowKey': goodName})

    } catch (err){
        console.log(err)
        res.status(404).json({"error": err})
    }
}

module.exports = {handleAddGood}