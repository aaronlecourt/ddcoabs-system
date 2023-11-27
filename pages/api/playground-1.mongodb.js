/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

import { ObjectId } from 'mongodb'

// Select the database to use.
use('dentfix');

// Insert a few documents into the sales collection.
// db.getCollection('user').insertMany([
//   {
//     'fullName': 'admin',
//     'email': 'admin@test.com',
//     'address': 'Makati City',
//     'mobile': '09123456789',
//     'birthday': new Date('03-23-97'),
//     'sex': 'F',
//     'password': 'admin',
//     'isAdmin': true

//   },
//   {
//     'fullName': 'client',
//     'email': 'clinet@test.com',
//     'address': 'Quezon City',
//     'mobile': '09993456999',
//     'birthday': new Date('04-04-94'),
//     'sex': 'M',
//     'password': 'password123',
//     'isAdmin': false
//   },
// ]);

// db.getCollection('dentist_service_type').insertMany([
//   {
//     'name': 'Jacket Crowns'
//   },
//   {
//     'name': 'Removable Partial Denture'
//   },
// ]);


db.getCollection('dentist_service').insertMany([
  {
    'name': 'Plastic (heat cure/lab fabricated)',
    'dentistServiceTypeID': '656413c2773285bbf0cc8415'
  },
  {
    'name': 'PMMA (Polymethy Methacrylate)',
    'dentistServiceTypeID': '656413c2773285bbf0cc8415'
  },
  {
    'name': 'PFM',
    'dentistServiceTypeID': '656413c2773285bbf0cc8415'
  },
  {
    'name': 'PFT (Tilite)',
    'dentistServiceTypeID': '656413c2773285bbf0cc8415'
  },
  {
    'name': 'EMAX',
    'dentistServiceTypeID': '656413c2773285bbf0cc8415'
  },
  {
    'name': 'Zirconia',
    'dentistServiceTypeID': '656413c2773285bbf0cc8415'
  },

  {
    'name': 'Anterior or Posterior Only',
    'dentistServiceTypeID': '656413c2773285bbf0cc8415'
  },
  {
    'name': 'Combination Anterior and Pasterior',
    'dentistServiceTypeID': '656413c2773285bbf0cc8415'
  },
  {
    'name': 'Complete Denture',
    'dentistServiceTypeID': '656413c2773285bbf0cc8415'
  },
]);


// Run a find command to view items sold on April 4th, 2014.
const user = db.getCollection('dentist_service').find({});

// Print a message to the output window.
console.log(user);

// Here we run an aggregation and open a cursor to the results.
// Use '.toArray()' to exhaust the cursor to return the whole result set.
// You can use '.hasNext()/.next()' to iterate through the cursor page by page.
// db.getCollection('sales').aggregate([
//   // Find all of the sales that occurred in 2014.
//   { $match: { date: { $gte: new Date('2014-01-01'), $lt: new Date('2015-01-01') } } },
//   // Group the total sales for each product.
//   { $group: { _id: '$item', totalSaleAmount: { $sum: { $multiply: [ '$price', '$quantity' ] } } } }
// ]);
