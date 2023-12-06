const { TableClient } = require("@azure/data-tables");

const handleGetFilteredGoods = async (req, res) => {
    const filter = req.body.filter
    try {
        const categoryTableClient = TableClient.fromConnectionString(process.env.connString, "categories", { allowInsecureConnection: true } );
        var categoryTableData = categoryTableClient.listEntities();
        
        var categoryTree = ""
        
        if (filter) {
            categoryTree = filter
            var currentParent

            var categoryData = []        
            var categorySet = new Set();
            let scanArray = []

            for await (const entity of categoryTableData) {
                categoryData.push(entity)
            }

            categoryData.forEach(entity => {
                if (entity.visibleName === `${filter}`){
                    currentParent = entity.parent
                    categorySet.add(entity.visibleName)
                    if (entity.childCategories !== '[]'){
                        let children = JSON.parse(entity.childCategories)
                        children.forEach(child => {
                            categorySet.add(child)
                            scanArray.push(child)
                        });
                    }
                }
            })


            while (scanArray.length > 0){
                categorySet.add(scanArray[0])
                categoryData.forEach(element => {
                    if (element.visibleName === scanArray[0] && element.childCategories !== '[]'){
                        let children = JSON.parse(element.childCategories)
                        children.forEach(child => {
                            scanArray.push(child)
                        });
                    }
                });
                scanArray.splice(0, 1)
            }

            if (currentParent){
                while (currentParent !== "rootCategory"){
                    categoryData.forEach(element => {
                        if (element.visibleName === currentParent) {
                            
                            categoryTree = element.visibleName + ' / ' + categoryTree
                            
                            currentParent = element.parent
                        }
                    });
                }
            }
            else {
                categoryTree = "Bad request"
            }
            
        }
        
        const tableClient = TableClient.fromConnectionString(process.env.connString, "goods", { allowInsecureConnection: true } );
        let tableData = tableClient.listEntities();
        var data = []
        if (filter){
            for await (const entity of tableData) {
                if (categorySet.has(entity.category)) {
                    data.push(entity)
                }
            }
        }
        else {
            for await (const entity of tableData) {
                data.push(entity)
            }
        }
        
        
        res.status(201).json({data: data, categoryTree: categoryTree})

    } catch (err){
        console.log(err)
        res.status(404).json({"error": err})
    }
}

module.exports = {handleGetFilteredGoods}