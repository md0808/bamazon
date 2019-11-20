// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
const mysql = require("mysql");

const inquirer = require("inquirer");
require('events').EventEmitter.prototype._maxListeners = 100;

const connection = mysql.createConnection({
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("\nManagement Functions\n\r\n");

    options();
});

function options() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choices",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function (choice) {
        switch (choice.choices) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
                exit();
                break;
        };
    });

};

function viewProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log(`${res[i].product_name} | Price: $${res[i].price} | Number in stock: ${res[i].stock_quantity} | Product Number: ${res[i].id}\n`);
        }
        whatsNext();
    });
}

function lowInventory() {
    console.log(" \n\r\n\r Products with low inventory: \n")
    var query = "SELECT product_name, stock_quantity FROM products WHERE stock_quantity <= 5";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].product_name + " || Quantity: " + res[i].stock_quantity + "\n")
        }
        whatsNext();
    });
};

function addInventory() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "product",
                message: "Which product would you like to add more of (enter the product number)?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false
                    }
                }
            },
            {
                type: "input",
                name: "quantity",
                message: "How many of this product would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }

        ]).then(function (answers) {
            let query = "SELECT product_name, id, stock_quantity FROM bamazon.products WHERE id =" + answers.product;
            connection.query(query, function (err, res) {

                let productID = parseInt(answers.product);
                let addAmount = parseInt(answers.quantity);
                let previousQuantity = parseInt(res[0].stock_quantity);
                console.log("previous quantity of " + res[0].product_name + ": " + res[0].stock_quantity)

                let newQuantity = previousQuantity + addAmount;
                console.log("update " + res[0].product_name + " to " + newQuantity)

                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newQuantity
                        },
                        {
                            id: productID
                        }

                    ],
                    function (err, res) {
                        if (err) throw err;
                        console.log("Product inventory updated\n");
                        whatsNext();
                    });

            });
        })


};

function addProduct() {
    console.log("add a product")
    inquirer
    .prompt([
        {
            type: "input",
            name: "name",
            message: "Name of the product you would like to add: ",

        },
        {
            type: "input",
            name: "dept",
            message: "Which department does this product belong in? ",

        },
        {
            type: "input",
            name: "price",
            message: "What is the price of one unit?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "How many of this product would you like to add?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return false;
                }
            }
        }

    ]).then(function (answers) {
        let query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" +
            answers.name + "', '" + answers.dept + "', " + answers.price + ", " +  answers.quantity + ");";
            connection.query(query, function(err, res) {
                if (err) throw err;
                connection.query ("SELECT * from products ORDER BY ID DESC LIMIT 1", function(err, res) {
                    console.log(" You have added " + res[0].product_name) + " to the product inventory.";
                    whatsNext();

                });
  

            });
    });

}

function whatsNext() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do next?",
            name: "next",
            choices: ["Return to Menu", "Exit the store"]
        }
    ]).then(function (answer) {
        switch (answer.next) {
            case "Return to Menu":
                options();
                break;
            case "Exit the store":
                exit();
                break;
            default: exit();
        }

    })
}

function exit() {
    connection.end();
}
