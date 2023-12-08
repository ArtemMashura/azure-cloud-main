const { TableClient } = require("@azure/data-tables");

const handleDeleteCategory = async (req, res) => {
    const { categoryName } = req.body;
    let cascade = false
    if (req.body.cascade === "true"){
        cascade = true
    }
    
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "categories", { allowInsecureConnection: true } );
        if (cascade === true) {
            let cascadeCollapseQueue = [categoryName]
            do {
                try {
                    var start = await tableClient.getEntity("GoodsCategory", cascadeCollapseQueue[0])
                } catch {
                    cascadeCollapseQueue.shift()
                    continue
                }
                let childCategories = JSON.parse(start.childCategories)
                childCategories.forEach(element => {
                    cascadeCollapseQueue.push(element)
                });
                var deleteResult = await tableClient.deleteEntity("GoodsCategory", cascadeCollapseQueue[0]);
                cascadeCollapseQueue.shift()
            } while (cascadeCollapseQueue.length > 0)
            res.status(201).json({'output': `Category ${categoryName} deleted with cascade`, 'result': deleteResult})

        } else {
            var deleteResult = await tableClient.deleteEntity("GoodsCategory", categoryName);
            res.status(201).json({'output': `Category ${categoryName} deleted`, 'result': deleteResult})
        }
      
    } catch (err){
        console.log(err)
        res.status(404).json({"error": err})
    }
}

module.exports = {handleDeleteCategory}