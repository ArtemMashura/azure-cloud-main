const { TableClient } = require("@azure/data-tables");

const handleDeleteCategory = async (req, res) => {
    const { categoryName } = req.body;
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "categories", { allowInsecureConnection: true } );
        
        await tableClient.deleteEntity("GoodsCategory", categoryName);
        res.status(201).json({'success': `Category ${categoryName} deleted`})
    } catch (err){
        res.status(404).json({"error": err})
    }
}

module.exports = {handleDeleteCategory}