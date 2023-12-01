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
                console.log(cascadeCollapseQueue[0])
                let start = await tableClient.getEntity("GoodsCategory", cascadeCollapseQueue[0])
                let childCategories = JSON.parse(start.childCategories)
                childCategories.forEach(element => {
                    cascadeCollapseQueue.push(element)
                });
                await tableClient.deleteEntity("GoodsCategory", cascadeCollapseQueue[0]);
                cascadeCollapseQueue.shift()
            } while (cascadeCollapseQueue.length > 0)
            res.status(201).json({'success': `Category ${categoryName} deleted with cascade}`})

        } else {
            await tableClient.deleteEntity("GoodsCategory", categoryName);
            res.status(201).json({'success': `Category ${categoryName} deleted}`})
        }
      
    } catch (err){
        res.status(404).json({"error": err})
    }
}

module.exports = {handleDeleteCategory}