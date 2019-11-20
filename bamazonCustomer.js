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
    console.log("\nWelcome to Bamazon! \n Take a look at our inventory:\n\r\n");

    showInventory();
});



function showInventory() {
    let query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log(`${res[i].product_name} | Price: $${res[i].price} | Number in stock: ${res[i].stock_quantity} | Product Number: ${res[i].id}\n`);
        }
        getProduct(res);
    });
};

function whatsNext() {
    inquirer.prompt([
        {
            type: "list",
            message: "What's next?",
            name: "next",
            choices: ["Shop some more", "Exit the store"]
        }
    ]).then(function (answer) {
        switch (answer.next) {
            case "Shop some more":
                showInventory();
                break;
            case "Exit the store":
                quit();
                break;
            default: quit();
        }

    })
}

function getProduct() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "number",
                message: "What's the product number of the item you want to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false
                    }
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }

        ]).then(function (answer) {
            let quantity = parseInt(answer.quantity);
            let proNum = parseInt(answer.number)
            let query = "SELECT id, stock_quantity, product_name, price FROM bamazon.products";
            connection.query(query, function (err, res) {
                if (err) throw err;
                // console.log(res);
                for (let i = 0; i < res.length; i++) {
                    if (res[i].id == proNum) {
                        if (res[i].stock_quantity >= quantity) {
                            let totalPrice = parseFloat(quantity * res[i].price, 10, 2);
                            console.log(quantity + " of " + res[i].product_name)
                            console.log(`We have that in stock! That will be $${totalPrice}`)
                            inquirer.prompt([
                                {
                                    type: "confirm",
                                    message: "Confirm Purchase",
                                    name: "confirm_purchase",
                                }
                            ]).then(function (answer) {
                                if (answer.confirm_purchase == true) {
                                    console.log("purchase confirmed for " + quantity + " of " + res[i].product_name + " at $" +
                                        totalPrice);
                                    updateInventory(res[i], quantity);
                                } else {
                                    whatsNext();
                                };

                            })

                        } else {
                            console.log(`There is only ${res[i].stock_quantity} in stock. Your order cannnot be completed
                             \n\r\n`);
                            whatsNext();

                        }
                    }
                }
            })
        })
}


function updateInventory(item, amountSold) {
    let newQuantity = parseInt(item.stock_quantity - amountSold);
    if (newQuantity > 0) {
        let query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: newQuantity
                },
                {
                    id: item.id
                }

            ],
            function (err, res) {
                if (err) throw err;
                console.log("\n\r\n Inventory Updated.");
                whatsNext();
            }

        )

    } else {
        console.log(`You got the last of ${item.product_name}`);
        whatsNext();
    }
}

function quit() {
    connection.end();
}
