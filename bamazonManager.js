var connect = require('./mysql.js');
var inquirer = require('inquirer');
// store the inquirer prompt in a var per the npm inquirer docs
var prompt = inquirer.createPromptModule();

	function listActions() {
		
		prompt({
			name: 'action',
			type: 'list',
			message: 'What would you like to do?',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
		}).then(function(answer) {
			
			switch(answer.action) {

				case 'View Products for Sale':

					viewProducts();
					break;

				case 'View Low Inventory':

					viewLowInventory();
					break;

				case 'Add to Inventory':

					addToInventory();
					break;

				case 'Add New Product':

					// calling the departmentList() function so we can get the current list of departments
					// and pass it to the prompt that asks the manager to enter the department name for the
					// new product.
					departmentList();
					break;

				default:

					listActions();
			}
		});
	} 

	function viewProducts() {
			
		connect.connection.query('SELECT * FROM products', function(err, data) {

			if (err) throw err;

			console.log('\nItems available for sale:\n');

			var data_length = data.length;
			for (var i = 0; i < data_length; i++) {
				console.log('  ' + data[i].item_id+ ' "' + data[i].product_name + '" DEPT: ' + data[i].department_name + ' - PRICE: $' + data[i].price + ' - Qty: ' + data[i].stock_quantity + '\n');
			}

			listActions();
			
		}); 
	} 

	function viewLowInventory() {
		
		var query = 'SELECT * FROM products WHERE stock_quantity < 5';

		connect.connection.query(query, function(err, data) {

			if (err) throw err;

			console.log('\nItems with quantity less than 5:\n');

			var data_length = data.length;
			for (var i = 0; i < data_length; i++) {
				console.log('  ' + data[i].item_id + ' "' + data[i].product_name + '" DEPT: ' + data[i].department_name + ' - PRICE: $' + data[i].price + ' - Qty: ' + data[i].stock_quantity + '\n');
			} 

			listActions();
			
		});
	}

	function addToInventory() {
		// ask the user which product they would like to update
		prompt([{
			name: 'id',
			type: 'input',
			message: 'What is the ID of the Product you would like to update?',
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
			message: 'How many would you like to add?',
			validate: function(value) {
				// check if the user entered value is a number
				if (isNaN(value) == false) {
					return true;

				} else {

					console.log('\n\nWe need a number for the amount.\n');
					return false;

				} 
			} 
		}]).then(function(answer) {

			var item_int = parseInt(answer.id);
			var amount_int = parseInt(answer.amount);
			
    		var query = 'UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?';

    		// update the Products table with the new stock_1uantity for the purchased item
    		connect.connection.query(query, [amount_int, item_int], function(err, data) {

				if (err) throw err;

				console.log('\nQuantity has been updated\n');

	    		listActions();

    		}); 
		});
	} 

	// get the most current list of departments from the Departments table
	function departmentList() {
		var department_list = [];

		var query = 'SELECT department_name FROM departments';
		
		// grab the department names
		connect.connection.query(query, function(err, data) {
			
			if (err) throw err;

			// loop through each department name returned from data
			var data_length = data.length;
			for (var i = 0; i < data_length; i++) {
				department_list.push(data[i].department_name);
			} 

			// call addNewProduct and pass the completed department_list array
			addNewProduct(department_list);

		}); 
	}

	// addNewProduct() takes in the most current department list passed from addNewProduct()
	// to use in the prompt asking the manager for the department name of the new product
	function addNewProduct(dep_list) {
		
		// ask the user what product they would like to add
		prompt([{
			name: 'name',
			type: 'input',
			message: 'What is the name of the new product?',
			validate: function(value) {
				// check if the user entered anything
				if (value !== '') {
					return true;

				} else {

					console.log('\n\nIt doesn\'t appear as if you entered anything. Try again.\n');
					return false;
				} 
			} 
		}, {
			name: 'department',
			type: 'list',
			message: 'What department should this new product be part of?',
			choices: dep_list 
		}, {
			name: 'price',
			type: 'input',
			message: 'How much does this product sell for?',
			validate: function(value) {
				// check if the user entered value is a number
				if (isNaN(value) == false) {
					return true;

				} else {

					console.log('\n\nWe need a number for the price.\n');
					return false;
				}
			}
		}, {
			name: 'amount',
			type: 'input',
			message: 'How many do we have on hand?',
			validate: function(value) {
				// check if the user entered value is a number
				if (isNaN(value) == false) {
					return true;

				} else {

					console.log('\n\nWe need a number for the stock quantity.\n');
					return false;

				}
			} 
		}]).then(function(answer) {

			var price_int = parseFloat(answer.price);
			var amount_int = parseInt(answer.amount);
			
    		var query = 'INSERT INTO products SET ?';

    		// store the values into an object to pass to connection.query()
    		var values = {
    			product_name: answer.name,
    			department_name: answer.department,
    			price: price_int,
    			stock_quantity: amount_int
    		}

    		connect.connection.query(query, values, function(err, data) {

				if (err) throw err;

				console.log('\nProduct has been added\n');

	    		// start the process over and list actions
	    		listActions();

    		});		
		});
	}

	listActions();
