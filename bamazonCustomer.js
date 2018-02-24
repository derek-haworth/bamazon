
var connect = require('./mysql.js');
var inquirer = require('inquirer');
// store the inquirer prompt in a var per the npm inquirer docs
var prompt = inquirer.createPromptModule();

	function displayProducts() {
		
		connect.connection.query('SELECT * FROM products', function(err, data) {
			if (err) throw err;

			console.log('\nWelcome to the Bamazon.\n');

			// loop through the list of items and display to the screen
			var data_length = data.length;
			for (var i = 0; i < data_length; i++) {
				console.log('  ' + data[i].ItemID + ' "' + data[i].ProductName + '" FORMAT: ' + data[i].DepartmentName + ' - PRICE: $' + data[i].Price + ' - Qty: ' + data[i].StockQuantity + '\n');
			}

			// call the selectProduct function here so that it's called once the products have been displayed
			selectProduct();
			
		}); 
	}

	// ask user which product they would like to buy
	function selectProduct() {
		prompt([{
			name: 'id',
			type: 'input',
			message: 'What is the ID of the Product you would like to buy?',
			validate: function(value) {
				// check if the user entered value is a number
				if (isNaN(value) == false) {
					return true;
				} else {
					console.log('\n\nAll we need is the number next to the title.\n');
					return false;
				} 
			} 
		}, {
			name: 'amount',
			type: 'input',
			message: 'How many would you like to buy?',
			validate: function(value) {
				// check if the user entered value is a number
				if (isNaN(value) == false) {
					return true;
				} else {
					console.log('\n\nWe need a number for the amount.\n');
					return false;
				}
			}
		// pass the id and amount to the purchaseProduct function to complete the transaction
		}]).then(function(answer) {

			// call the purchaseProduct() function
		
		}); 
	} 