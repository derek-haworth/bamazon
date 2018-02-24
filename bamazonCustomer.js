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
				console.log('  ' + data[i].item_id + ' "' + data[i].product_name + '" FORMAT: ' + data[i].department_name + ' - PRICE: $' + data[i].price + ' - Qty: ' + data[i].stock_quantity + '\n');
			}

			// call the selectProduct function here so that 
			// it's called once the products have been displayed
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

			purchaseProduct(answer);
		
		}); 
	} 

	// check the inventory and purchase the product with the itemID and amount to purchase
	function purchaseProduct(selected_item) {

		selected_item_int = parseInt(selected_item.amount);
		
		var query_select = 'SELECT * FROM products WHERE ?';

        connect.connection.query(query_select, {item_id: selected_item.id}, function(err_select, data_select) {

			if (err_select) throw err_select;
            
            // check if the amount in stock is less than the selected amount
        	if (data_select[0].stock_quantity < selected_item_int) {

        		console.log('\nSorry, but you selected to purchase more than we have in stock. Please look over our products and make another selection.\n');

        		// start the process over 
        		selectProduct();

        	} else {

        		var new_quantity = data_select[0].stock_quantity - selected_item_int;

        		// store the price paid into a variable
        		var total_price = data_select[0].price * selected_item_int;

        		var query_update = 'UPDATE products p, departments d SET p.stock_quantity = ?, d.total_sales = d.total_sales + ? WHERE p.item_id = ? AND d.department_name = ?';

        		// update the Products table with the new stock_quantity for the purchased item
        		connect.connection.query(query_update, [new_quantity, total_price, data_select[0].item_id, data_select[0].department_name], function(err_update, data_update) {

					if (err_update) throw err_update;

        		});

        		console.log('\nThank you for your purchase. Total price is $' + total_price + '\n');

        		// start the process over and display the products
        		displayProducts();
        	}
        });
	} 

	displayProducts();