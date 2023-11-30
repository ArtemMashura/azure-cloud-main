const { TableClient } = require("@azure/data-tables");

const handleCreateCategory = async (req, res) => {
    const { categoryParent, categoryName, categoryVisibleName } = req.body;
    if (!categoryVisibleName){
        categoryVisibleName = categoryName;
    }
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "categories", { allowInsecureConnection: true } );
        const task = {
            partitionKey: "GoodsCategory",
            rowKey: categoryName,
            parent: categoryParent,
            visibleName: categoryVisibleName
        };
        await tableClient.createEntity(task);
        res.status(201).json({'success': `New category ${categoryName} created`})
    } catch (err){
        res.status(404).json({"error": err})
    }
}

module.exports = {handleCreateCategory}