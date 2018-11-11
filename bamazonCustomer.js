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
	// start();
	});
	connection.end();
};

// function start () {
// 	inquirer.prompt([
// 	{
// 		type: "input",
// 		name: "id",
// 		message: "What is the ID of the starter pokemon you would like to buy?",
// 		validate: function (answer) {
// 			return new Promise ((resolve, reject) => {
// 				var query = "SELECT item_id FROM products";
// 				connection.query(query, function(err, res) {
// 					if (err) {throw err;}
// 					var flag = false;
// 					for (var i in res) {
// 						if (res[i].item_id == answer) {
// 							flag = true;
// 							break;
// 						}
// 					}
// 					if (flag) {
// 						resolve(true);
// 					}
// 					else {
// 						reject('ID UNKNOWN');
// 					}
// 				})
// 			})
// 		}
// 	},
// 	{
// 		type: "input",
// 		name: "quantity",
// 		message: "How many of this pokemon would you like?",
// 		validate: function (answer) {
// 			var input = answer;
// 			return new Promise ((resolve, reject) => {
// 				var check = isNaN(input);
// 				var flag = false;
// 				if (check) {
// 					flag = false;
// 				}
// 				else {flag = true;}

// 				if (flag) {
// 					resolve(true);
// 				}
// 				else {
// 					reject('Not a valid quantity');
// 				}
// 			})
// 		}
// 	}
// 	]).then(function(answers) {
// 		var oldStock = 0;
// 		var newStock = 0;
// 		var oldPurchased = 0;
// 		var purchased = 0;
// 		var id;
// 		connection.query("SELECT * FROM products WHERE ?", 
// 			{
// 				item_id: answers.id
// 			},
// 			(err, results, fields) => {
// 				if (err) {throw err;}
// 				else {
// 					oldStock = results[0].stock_quantity;
// 					newStock = oldStock - answers.quantity;
// 					oldPurchased = results[0].product_sales;
// 					purchased = answers.quantity * results[0].price;
// 					id = answers.id;
// 					if (newStock > -1) {
// 						connection.query("UPDATE products SET ? WHERE ?",
// 							[{
// 						 		stock_quantity: newStock
// 						 	},
// 						 	{
// 						 		item_id: answers.id
// 						 	}],
// 						 	(err, results, fields) => {
// 						 		if (err) {throw err;}
// 						 		else{
// 						 			console.log("Tickets purchased!")
// 						 			var newPurchased = parseInt(oldPurchased) + parseInt(purchased);
// 						 			connection.query("UPDATE products SET ? WHERE ?",
// 						 				[{
// 						 					product_sales: newPurchased
// 						 				},
// 						 				{
// 						 					item_id: id
// 						 				}],
// 						 				(err, results, fields) => {
// 						 					if (err) {throw err;}
// 						 					console.log("Quantity updated");
// 						 					displayAll();
// 						 				})
// 						 		}
// 							})
// 					}
// 					else {
// 						console.log("Insufficient quantity!");
// 						displayAll();
// 					}
// 				}
// 			})
// 	});
// }