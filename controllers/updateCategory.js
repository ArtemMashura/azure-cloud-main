const { TableClient } = require("@azure/data-tables");

const handleUpdateCategory = async (req, res) => {
    const { categoryParent, categoryName, categoryVisibleName } = req.body;
    
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "categories", { allowInsecureConnection: true } );
        const task = {
            partitionKey: "GoodsCategory",
            rowKey: categoryName,
            parent: categoryParent,
            visibleName: categoryVisibleName
        };
        await tableClient.updateEntity(task, "Merge");
        res.status(201).json({'success': `Category ${categoryName} updated`})
    } catch (err){
        res.status(404).json({"error": err})
    }
}

module.exports = {handleUpdateCategory}