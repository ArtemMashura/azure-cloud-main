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
            visibleName: categoryVisibleName,
            childCategories: JSON.stringify([])
        };

        if (categoryParent !== "rootCategory"){
            let parent = await tableClient.getEntity("GoodsCategory", categoryParent)

            let insertResult = await tableClient.createEntity(task);

            let old_childCategories = JSON.parse(parent.childCategories)
            old_childCategories.push(categoryName)
            const updateParent = {
                partitionKey: "GoodsCategory",
                rowKey: categoryParent,
                childCategories: JSON.stringify(old_childCategories)
            };
            let updateParentResult = await tableClient.updateEntity(updateParent, "Merge");
            res.status(201).json({'insert': insertResult, 'update': updateParentResult})
        }
        else {
            let insertResult = await tableClient.createEntity(task);
            res.status(201).json({'insert': insertResult})
        }
        
        
    } catch (err){
        res.status(err.statusCode).json({"error": err})
    }
}

module.exports = {handleCreateCategory}