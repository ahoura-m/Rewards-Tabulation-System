# Fetch Rewards Backend Take Home Test

This is Ahoura's submission for the Fetch Rewards Backend Test. This repo has also been uploaded to Replit which would allow you to test without having to download it on your computer.
https://replit.com/@ahoura-m/Fetch-Rewards-Backend-Take-Home-Test#controllers/mainController.js

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes.

### Installing

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/ahoura-m/Fetch-Rewards-Backend-Take-Home-Test.git

# Go into the repository
$ cd Fetch-Rewards-Backend-Take-Home-Test

# Install dependencies
$ npm install

# Run the app
$ npm start
```

## Running the tests

The following is the diagram outlining the flow of the application and testing method.

![image](https://user-images.githubusercontent.com/102436343/201732377-3b42b893-ae79-496a-a86e-d2069d04a601.png)



### Add Transaction


**POST** [http://localhost:3000/add-tx](http://localhost:3000/add-tx)

**RETURNS** all transactions posted to the account

![image](https://user-images.githubusercontent.com/102436343/201731377-d361b013-35e9-48e7-94d1-e8123679912f.png)



### Spend


**POST** [http://localhost:3000/spend](http://localhost:3000/spend)

**RETURNS** how muchs points were deducted from each payer

![image](https://user-images.githubusercontent.com/102436343/201731922-f151d6c1-0d9c-4b47-86f9-0cf6b9b1b616.png)


### Balance


**GET** [http://localhost:3000/balance](http://localhost:3000/add-tx)

**RETURNS** all payer points balances

![image](https://user-images.githubusercontent.com/102436343/201732137-75358338-3b76-4c7b-a5fe-30b4181b15c9.png)





## Built With

  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)

