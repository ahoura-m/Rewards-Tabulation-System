/**
 * Declaring variables that will hold all the data in memory
 * txHistory is mainly for accounting purposes, it including negative transactions both from spend and add-tx. It isn't returned by any of the API calls
 * e.g. tx history =  
 *   [{ payer: 'DANNON', points: 300, timestamp: 1667210400000 },
 *    { payer: 'UNILEVER', points: 200, timestamp: 1667214000000 },
 *    { payer: 'DANNON', points: -200, timestamp: 1667228400000 }]
 * pointsAR holds all the outstanding points
 *e.g. pointsAR = 
 *   [{ payer: 'DANNON', points: 100, timestamp: 1667210400000 },
 *    { payer: 'UNILEVER', points: 200, timestamp: 1667214000000 }]
 */
let txHistory = []
let pointsAR = []

/**
 * Calculates point balances based on the input
 * if obj is set to true, the output will be an object with all the payers and their balances
 * if payer is set to true, the output will be the point balance of that specific payer
 * if no arguments are passed in, the output will be the total points the user has
 */
const calcBal = (obj, payer) => {
    if (obj){
        let balance = {}
        for (let el of pointsAR){
            balance[el["payer"]] = balance[el["payer"]] + el["points"] || el["points"]
        }
        return balance
    }
    else if (payer){
        let balance = 0
        for (let el of pointsAR){
            if (el["payer"] !== payer) continue
            balance += el["points"]
        }
        return balance
    }
    else{
        let balance = 0
        for (let el of pointsAR){
            balance += el["points"]
        }
        return balance
    }
}


//addTx will add transactions to the user's account
exports.addTx = async (req,res) => {
    try{
        let tx = req.body
        
        //Checking for input errors
        if (!tx.hasOwnProperty('payer') || !tx.hasOwnProperty('points') || !tx.hasOwnProperty('timestamp')) throw new Error('Invalid property value: Make sure you have payers, points and timestamp in your request')
        if (Object.keys(tx).length !== 3) throw new Error('Invalid number of properties, make sure you only have payer, points and timestamp in your request')
        if (isNaN(+tx["points"])) throw new Error('Invalid Points Amount: Make sure your amount is a valid number')
        if (isNaN(Date.parse(tx["timestamp"]))) throw new Error('Invalid Timestamp: Make sure your timestamp is a valid date')
        tx["points"] = parseInt(tx["points"])
        if (-tx["points"] > calcBal(false,tx["payer"])) throw new Error(`${tx["payer"]} has insufficient points, can't deduct ${tx["points"]} points`)
        tx["timestamp"] = Date.parse(tx["timestamp"])
        
        //Adding transaction to txHistory and then sorting it
        txHistory.push({...tx})
        txHistory.sort((a,b) => a.timestamp - b.timestamp)

        //if the points amount is more than 0, we will also add it to the pointsAR and sort it
        if (tx["points"] > 0){
            pointsAR.push({...tx})
            pointsAR.sort((ab,bb) => ab.timestamp - bb.timestamp)
        }
        //if the points amount is less than 0, we will need to deduct it first from the payer's outstanding balance first and update pointsAR
        else if (tx["points"] < 0){
            var txPoints = tx["points"]
            for (let i = 0; i < pointsAR.length; i++){
                if (pointsAR[i]["payer"] === tx["payer"]){
                    if (pointsAR[i]["points"] >= -txPoints){   //txPoints is negative
                        pointsAR[i]["points"] += txPoints
                        break
                    }
                    else {
                        txPoints -= pointsAR[i]["points"]
                        //pointsAR.splice(i,1)
                        pointsAR[i]["points"] = 0
                    }
                }
            }
        }
        console.log("tx history: ",txHistory)
        console.log("Points AR:  ", pointsAR)
        res.json(txHistory)
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"})
    }
}


//Spenging user points and returning how much points were deducted from each payer
exports.spend = async (req,res) => {
    try{
        let spend = req.body
        let amount = spend["points"]
        let outputArr = []

        //Checking for input errors
        if (!spend.hasOwnProperty('points')) throw new Error('Invalid property value: Make sure you have only have points in your request')
        if (Object.keys(spend).length !== 1) throw new Error('Invalid number of properties, make sure you only have points in your request')
        if (isNaN(+amount)) throw new Error('Invalid Points Amount: Make sure your amount is a valid number')
        if (amount <= 0) throw new Error('Spend amount has to be above 0')
        if (amount > calcBal(false,false)) throw new Error('Insufficient points')
        var txPoints = parseInt(spend["points"])
        
        //Looping through points AR and figuring out how much points should be deducted from each payer
        for (let i = 0; i < pointsAR.length; i++){
            if (pointsAR[i]["points"] == 0) continue
            if (pointsAR[i]["points"] > txPoints){  
                outputArr.push({"payer" : pointsAR[i]["payer"], "points" : -txPoints})
                txHistory.push({"payer" : pointsAR[i]["payer"], "points" : -txPoints, "timestamp" : Date.now()})
                pointsAR[i]["points"] -= txPoints
                break
            }
            else {
                outputArr.push({"payer" : pointsAR[i]["payer"], "points" : -pointsAR[i]["points"]})
                txHistory.push({"payer" : pointsAR[i]["payer"], "points" : -pointsAR[i]["points"], "timestamp" : Date.now()})
                txPoints -= pointsAR[i]["points"]
                //pointsAR.splice(i,1)
                //i--
                pointsAR[i]["points"] = 0
            }
        }
        console.log("tx history: ",txHistory)
        console.log("Points AR:  ", pointsAR)
        res.json(outputArr)
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"})
    }
}


//Calculating the balance and returning an object with all the payer balances
exports.balance = async (req,res) => {
    try{
        let balance = calcBal(true,false)
        res.json(balance)
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"})
    }
}