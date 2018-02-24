var connect = require('./mysql.js');
var inquirer = require('inquirer');
// store the inquirer prompt in a var per the npm inquirer docs
var prompt = inquirer.createPromptModule();
var Table = require('cli-table');


	function listActions() {
		
		prompt({
			name: 'action',
			type: 'list',
			message: 'What would you like to do?',
			choices: ['View Product Sales by Department', 'Create New Department']

		}).then(function(answer) {
			
			switch(answer.action) {

				case 'View Product Sales by Department':

					viewSalesByDepartment();
					break;

				case 'Create New Department':

					createNewDepartment();
					break;

				default:

					listActions();

			} 
		});
	}

	function viewSalesByDepartment() {

		var query = 'SELECT * from departments';
		// pull up the sales data for each department
		connect.connection.query(query, function(err, data) {

			if (err) throw err;

			// create empty arrays to populate the cli-table npm
			var head_array = [];
			var table_data = [];

			// loop through the first object in the data array
			for (var key in data[0]) {
				head_array.push(key);
			}

			head_array.push('total_profit');

			// create a new instance of cli-table
			var table = new Table({
				head: head_array
			}); 


			var data_length = data.length;
			for (var i = 0; i < data_length; i++) {
			
				// loop through each object in the data array returned from connection
				for (var key in data[i]) {
					// push each value from each object into the table data array
					table_data.push(data[i][key]);
				}

				// store the profit (positive or negative) from the values in each object
				var total_profit = data[i].total_sales - data[i].over_head_costs;

				// push that profit amount into the table data array to populate that last column.
				table_data.push(total_profit.toFixed(2));

				// push all the data to the cli-table table
				table.push(table_data);

				// reset the table data to an empty string so we add data to a new array each time we loop through a new object
				table_data = [];

			} 

			// display table showing department details
			console.log(table.toString());

    		listActions();
		}); 
	}

	function createNewDepartment() {
		// ask the user what department they would like to add
		prompt([{
			name: 'name',
			type: 'input',
			message: 'What is the name of the new department?',
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
			name: 'overhead_costs',
			type: 'input',
			message: 'What are the overhead costs associated with this department?',
			validate: function(value) {
				// check if the user entered value is a number
				if (isNaN(value) == false) {
					return true;

				} else {

					console.log('\n\nWe need a number for the costs of the department.\n');
					return false;

				} 
			} 
		}, {
			name: 'total_sales',
			type: 'input',
			message: 'What are the total sales for the department?',
			validate: function(value) {
				// check if the user entered value is a number
				if (isNaN(value) == false) {
					return true;
				} else {

					console.log('\n\nWe need a number for the total sales of the department.\n');
					return false;

				} 
			} 
		// pass the name, overhead costs and total sales
		}]).then(function(answer) {

			var overhead_costs_int = parseFloat(answer.overhead_costs);
			var total_sales_int = parseFloat(answer.total_sales);
			
    		var query = 'INSERT INTO departments SET ?';

    		var values = {
    			department_name: answer.name,
    			over_head_costs: overhead_costs_int,
    			total_sales: total_sales_int
    		}

    		connect.connection.query(query, values, function(err, data) {

				if (err) throw err;

				console.log('\nDepartment has been created\n');

	    		listActions();

    		}); 
		});
	}

	listActions();