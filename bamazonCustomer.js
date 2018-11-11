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
		displayAll();
	}
});

function displayAll () {
	var query = "SELECT * FROM products";
	connection.query(query, function(err, res) {
		console.log(chalk.blue("\n---------------------------------------------------"));
	for (var i = 0; i < res.length; i++) {
		console.log(chalk.grey(`ID: ${res[i].item_id} • ${res[i].product_name} • ${res[i].department_name} • $${res[i].price} • ${res[i].stock_quantity} left in stock`));
		console.log(chalk.blue("---------------------------------------------------"));
	}
	console.log("\n");
	start();
	});
};

function start () {
	inquirer.prompt([
		{
			type: "input",
			name: "id",
			message: "What is the ID of the starter pokemon you would like to buy?",
		}
	]).then(function(answer) {
		var pokeID = parseFloat(answer.id);

		if ((pokeID - Math.floor(pokeID)) !== 0) {
			console.log(chalk.red("ERROR: ID# DOES NOT EXIST. PLEASE TRY AGAIN."));
			start();
		} else if (pokeID < 1 || pokeID > 10) {
			console.log(chalk.red("ERROR: ID# DOES NOT EXIST. PLEASE TRY AGAIN."));
			start();
		} else {
			inquirer.prompt([
			{
				type: "input",
				name: "quantity",
				message: "How many of this Pokemon would you like to buy?"
			}
			]).then(function(answer) {
				var query = "SELECT * FROM products WHERE ?";
				connection.query(query, {item_id: pokeID}, function (err, res) {
					if (err) {
						throw err;
					}
		
					var newStock = res[0].stock_quantity;
					newStock -= answer.quantity;
		
					if (newStock < 0) {
						console.log(chalk.yellow("Insufficient quantity! Try again please."));
						start();
					} else {
						var price = res[0].price;
						price *= answer.quantity;
						
						var query = "UPDATE products SET ? WHERE ?";
						connection.query(query, [{ stock_quantity: newStock }, { item_id: pokeID }], function (err) {
							if (err) {
								throw err;
							}
							console.log(chalk.green("\nTotal: $" + price));
							console.log(chalk.yellow("Thank you shopping with us! We catch'em all, so you don't have to!\n"));
							connection.end();
						})
					}
				})
			});	
		}
	});
}