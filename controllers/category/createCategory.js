const { TableClient } = require("@azure/data-tables");
const { v4: uuidv4 } = require("uuid");

const handleCreateCategory = async (req, res) => {
    const categoryName = uuidv4()
    const { categoryParent } = req.body;
    var categoryVisibleName
    if (!req.body.categoryVisibleName){
        categoryVisibleName = categoryName;
    }
    else {
        categoryVisibleName = req.body.categoryVisibleName
    }
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "categories", { allowInsecureConnection: true } );
        var childArr = []
        const task = {
            partitionKey: "GoodsCategory",
            rowKey: categoryName,
            parent: categoryParent,
            visibleName: categoryVisibleName,
            childCategories: JSON.stringify(childArr)
        };

        if (categoryParent !== "rootCategory"){
            try{
                let categoryTableData = tableClient.listEntities();
                for await (const entity of categoryTableData) {
                    console.log(entity)
                    if (entity.visibleName === categoryParent){
                        var parentName = entity.rowKey
                    }
                }
                var parent = await tableClient.getEntity("GoodsCategory", parentName)
            }
            catch {
                res.status(404).json({'error': "Couldn't find a parent"})
                return
            }

            let insertResult = await tableClient.createEntity(task);

            let old_childCategories = JSON.parse(parent.childCategories)
            old_childCategories.push(categoryVisibleName)
            const updateParent = {
                partitionKey: "GoodsCategory",
                rowKey: parentName,
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
        console.log(err)
        res.status(404).json({"error": err})
    }
}

module.exports = {handleCreateCategory}