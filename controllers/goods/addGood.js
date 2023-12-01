const { TableClient } = require("@azure/data-tables");

const handleAddGood = async (req, res) => {
    const {goodName, categoryName, goodVisibleName, price, thumbnailURL } = req.body;
    if (!categoryVisibleName){
        categoryVisibleName = categoryName;
    }
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "goods", { allowInsecureConnection: true } );
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

module.exports = {handleAddGood}