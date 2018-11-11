var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require('chalk');

var connection = mysql.createConnection({
	host: "127.0.0.1",
	port: 3306,
	user: "root",
	password: "password",
	database: "bamazon_db"
});

connection.connect((err) => {
	if (err) {throw err;}
	else {
		console.log("Connected as ID: " + connection.threadId);
		start();
	}
});

function start () {
    inquirer
      .prompt({
        type: "list",
		name: "command",
		choices: [
            "View Pokemon for Sale",
            "View Low Inventory", 
            "Add to Inventory", 
            "Add New Pokemon"
        ],
		message: "Welcome Bamazon Manager. What would you like to do?"
      })
      .then(function(answer) {    
        switch (answer.command) {
        case "View Pokemon for Sale":
          viewPokemon();
          break;
  
        case "View Low Inventory":
          lowInventory();
          break;
  
        case "Add to Inventory":
          addInventory();
          break;
  
        case "Add New Pokemon":
          addPokemon();
          break;
        }
    });
}

function viewPokemon() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) {
            throw err;
        }
        console.log(chalk.blue("\n-------------------------------------------------------------"));
        console.log(chalk.yellow("POKEMON FOR SALE:"));
        console.log(chalk.blue("-------------------------------------------------------------"));
    for (var i = 0; i < res.length; i++) {
        console.log(chalk.grey(`ID: ${res[i].item_id} • ${res[i].product_name} • ${res[i].department_name} • $${res[i].price} • ${res[i].stock_quantity} LEFT IN STOCK`));
        console.log(chalk.blue("-------------------------------------------------------------"));
    }

    console.log("\n");
    exit();
    });
}

function lowInventory () {
    var query = "SELECT * FROM products WHERE stock_quantity <= 5 ORDER BY stock_quantity DESC";
    connection.query(query, function(err, res) {
        if (err) {
            throw err;
        }
        console.log(chalk.blue("\n-------------------------------------------------------------"));
        console.log(chalk.yellow("LOW INVENTORY POKEMON:"));
        console.log(chalk.blue("-------------------------------------------------------------"));
    for (var i = 0; i < res.length; i++) {
        console.log(chalk.grey(`ID: ${res[i].item_id} • ${res[i].product_name} • ${res[i].department_name} • $${res[i].price} • ${res[i].stock_quantity} LEFT IN STOCK`));
        console.log(chalk.blue("-------------------------------------------------------------"));
    }
    console.log("\n");
    exit();
    });
}

function addInventory () {
    inquirer.prompt([
		{
			type: "input",
			name: "id",
			message: "Enter the ID# of the Pokemon you'd like to add inventory to: ",
		}
    ]).then(function(answer) {
		var pokeID = parseFloat(answer.id);
		
		var query = "SELECT * FROM products";
		connection.query(query, function(err, res) {

            var n = (parseInt(answer.id)).toString();
            var target;
			if (answer.id !== n) {
				console.log(chalk.red("ERROR: ID# IS INVALID. PLEASE TRY AGAIN."));
				addInventory();
			} else {
				var flag = 0;
				for (var i = 0; i < res.length; i++) {
					if (pokeID == res[i].item_id) {
                        flag = 1;
                        target = i;
					}
				}

				if (flag == 0) {
					console.log(chalk.red("ERROR: ID# DOES NOT EXIST. PLEASE TRY AGAIN."));
					addInventory();
				} else {
                    inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "add",
                            message: "How many of this Pokemon would you add?"
                        }
                        ]).then(function(answer) {
                            var newStock = parseInt(res[target].stock_quantity);
                            newStock += parseInt(answer.add);
                            
                            connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newStock}, {item_id: pokeID}], function (err, res) {
                                if (err) {
                                    throw err;
                                }
                                console.log(chalk.green("\nInventory has been updated.\n"));
                                exit();
                        })
                    });				
				}
			}
		})
	});
}

function addPokemon () {
    inquirer.prompt([

        {
            type: "input",
            name: "name",
            message: "What is the name of the Pokemon you'd like to add?"
        },
        {
            type: "input",
            name: "region",
            message: "What region is this Pokemon from?"
        },
        {
            type: "input",
            name: "price",
            message: "How much does one of these Pokemon cost?" 
        },
        {
            type: "input",
            name: "quantity",
            message: "How much of this Pokemon would you like to add to inventory?"
        }

        ]).then(function(answer) {

        var query = "SELECT * FROM products";
            connection.query(query, function(err, res) {
                if (err) {
                    throw err;
                }
            
            var flag = 0;
            for (var i = 0; i < res.length; i++) {
                if(answer.name === res[i].product_name) {
                    flag = 1;
                }
            } 
                
            if (flag === 1) {
                console.log(chalk.yellow("This Pokemon is already in the system. Please try again."));
                addPokemon();
            } else {
                connection.query("INSERT INTO products SET ?", 
                {
                    product_name: answer.name,
                    department_name: answer.region,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },
                function(err, res) {
                    console.log(chalk.green("\nPokemon successfully added!\n"));
                    exit();
                        if (err) {
                            throw err;
                        }
                });
            }
        });
    });
}

function exit () {
    inquirer
        .prompt({
            type: "list",
            name: "command",
            choices: [
                "Back to menu.",
                "Go away Bamazon Manager! (Exit program.)"
            ],
            message: "What would you like to do now?"
        })
        .then(function(answer) {
            switch (answer.command) {
            case "Back to menu.":
            start();
            break;
    
            case "Go away Bamazon Manager! (Exit program.)":
            console.log(chalk.yellow("Okay bye..."));
            connection.end();
            break;
        }
    });
}