const { TableClient } = require("@azure/data-tables");

const handleUpdateCategory = async (req, res) => {
    const { categoryName, categoryParent, categoryVisibleName, childrenAdd, childrenRemove } = req.body;
    let feedback = []
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "categories", { allowInsecureConnection: true } );
        const task = {
            partitionKey: "GoodsCategory",
            rowKey: categoryName,
            
        };
        if (categoryParent){
            task.parent = categoryParent
        }
        if (categoryVisibleName){
            task.visibleName = categoryVisibleName
        }
        
        let test = JSON.stringify(childrenAdd)
        let test1 = JSON.stringify(childrenRemove)
        
        if (childrenAdd || childrenRemove){
            let parent = await tableClient.getEntity("GoodsCategory", categoryName)
            let childCategories = JSON.parse(parent.childCategories)
            if (childrenRemove){
                let test12 = JSON.parse(test1)
                test12.forEach(element => {
                    const index = childCategories.indexOf(element);
                    if (index > -1) { // only splice array when item is found
                        childCategories.splice(index, 1); // 2nd parameter means remove one item only
                    }
                    else {
                        feedback.push(`Category ${element} not found, skipped over`)
                    }
                });
            }
            if (childrenAdd){
                let test123 = JSON.parse(test)
                test123.forEach(element => {
                    childCategories.push(element)
                });
            }
            task.childCategories = JSON.stringify(childCategories)

            
        }
        

        let updateResult = await tableClient.updateEntity(task, "Merge");
        res.status(201).json({'result': updateResult, 'feedback': `${JSON.stringify(feedback)}`})
    } catch (err){
        console.log(err)
        res.status(404).json({"error": err})
    }
}

module.exports = {handleUpdateCategory}