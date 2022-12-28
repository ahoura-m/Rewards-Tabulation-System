# Fetch Rewards Backend Test

This is an API designed to keep track of a user's points per payer.

## Background:

Our users have points in their accounts. Users only see a single balance in their accounts. But for reporting purposes we actually track their points per
payer/partner. In our system, each transaction record contains: payer (string), points (integer), timestamp (date).

For earning points it is easy to assign a payer, we know which actions earned the points. And thus which partner should be paying for the points.

When a user spends points, they don't know or care which payer the points come from. But, our accounting team does care how the points are spent.

There are two rules for determining what points to "spend" first:
● We want the oldest points to be spent first (oldest based on transaction timestamp, not the order they’re received)
● We want no payer's points to go negative.

The API provides routes that:

● Add transactions for a specific payer and date.
● Spend points using the rules above and return a list of { "payer": <string>, "points": <integer> } for each call.
● Return all payer point balances.

## Example:

  
Suppose you call your add transaction route with the following sequence of calls:
  
  
● { "payer": "DANNON", "points": 300, "timestamp": "2022-10-31T10:00:00Z" }
● { "payer": "UNILEVER", "points": 200, "timestamp": "2022-10-31T11:00:00Z" }
● { "payer": "DANNON", "points": -200, "timestamp": "2022-10-31T15:00:00Z" }
● { "payer": "MILLER COORS", "points": 10000, "timestamp": "2022-11-01T14:00:00Z" }
● { "payer": "DANNON", "points": 1000, "timestamp": "2022-11-02T14:00:00Z" }

  
Then you call your spend points route with the following request:

  
{ "points": 5000 }

  
The expected response from the spend call would be (since Dannon had a previous spend record):

  
[
{ "payer": "DANNON", "points": -100 },
{ "payer": "UNILEVER", "points": -200 },
{ "payer": "MILLER COORS", "points": -4,700 }
]

  
A subsequent call to the points balance route, after the spend, should returns the following results:

  
{
"DANNON": 1000,
”UNILEVER” : 0, ,
"MILLER COORS": 5300
}


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

