## Set Up Backend Server ##
Either run the Java backend by using your IDE or by typing 

```
mvn install
mvn exec:exec
```
in the back-end folder. This will start the Java server at http://localhost:8080.

## Set Up Frontend Server ##
In the front-end folder, run

```
npm install
npm start
```

This will start the front-end server at http://localhost:3000.

## How to Play Santorino ##

1. Two players take turns to initialize both of the workers (one by one)

2. Start a new turn, repeat:

    1) Current player selects a worker and chooses a moving destination
        a. Click on the worker to select different workers
        b. the worker cannot be changed after movement this turn
        
    2) After movement, current player choose a space to build a block

3. If a worker is standing on a level-3 tower, the player wins