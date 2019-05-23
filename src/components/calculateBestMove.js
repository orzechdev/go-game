import { evaluateBoard } from "./boardStateEvaluation";
import { isFieldSurroundedByJustOneColor, isGameFinished, checkFinalPoints } from "./boardFinishEvaluation";
import { colors } from "./boardConsts";
import { checkCurrentPoints } from "./boardCurrentEvaluation";
import { calculateMoveMaxMinOutcome } from "./calculateBestValueWorker";

/**
 * Returns object with outcome, x and y where player should set stone 
 * to potentially obtain best results calculated by min-max algorithm 
 */
export const calculateMinMaxMove = async (currValues, playerColor, depth = 1) => {
  return await calculateBestMove(currValues, playerColor, depth * 2)
}

/**
 * It gives best (max) new values (worst for opponent)
 */
export const calculateBestMove = async (currValues, playerColor, depthIteration) => {
  const movesOutcomes = await calculateMovesOutcomes(currValues, playerColor, depthIteration)

  // console.log('ACHTUNG BEST');
  // console.log(movesOutcomes);//{outcome: -1000, y: 5, x: 5}//

  const bestRowResult = movesOutcomes.map(row => 
    row.reduce((prev, current) => 
      (prev.outcome > current.outcome) ? prev : current
    )
  )

  const bestResult = bestRowResult.reduce((prev, current) => 
    (prev.outcome > current.outcome) ? prev : current
  );

  return bestResult;
}
/**
 * It gives worst (min) new values (best for opponent)
 */
export const calculateWorstCountermove = async (currValues, playerColor, depthIteration) => {
  const movesOutcomes = await calculateMovesOutcomes(currValues, playerColor, depthIteration)

  // console.log('ACHTUNG WORST');
  // console.log(movesOutcomes);//{outcome: -1000, y: 5, x: 5}//

  const worsrRowCounterresult = movesOutcomes.map(row =>
    row.reduce((prev, current) => 
      (prev.outcome < current.outcome) ? prev : current
    )
  );

  // console.log('ACHTUNG 2');
  // console.log(worsrRowCounterresult);//{outcome: -1000, y: 5, x: 5}//

  const worstCounterresult = worsrRowCounterresult.reduce((prev, current) => 
    (prev.outcome < current.outcome) ? prev : current
  );

  // console.log('ACHTUNG 3');
  // console.log(worstCounterresult);//{outcome: -1000, y: 5, x: 5}//

  return worstCounterresult;
}

/**
 * It calculates possible values with their outcomes for player
 */
export const calculateMovesOutcomes = async (currValues, playerColor, depthIteration) => {
  let movesOutcomes = [
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null,null],
  ];

  let promises = [];
  
  for (let y = 0; y < currValues.length; y++) {
    for (let x = 0; x < currValues[y].length; x++) {
      const val = currValues[y][x];
      // It would be better to parallelize it...
      if (isEvenIteration(depthIteration)) {
        const promise = new Promise(function(resolve) {
          var v = new Worker('./kurwajebacto.js');
          v.postMessage("JEBANE GÓWNO KURWA");
          // v.postMessage({currValues, playerColor, val, y, x, depthIteration});
          v.onmessage = function(event){
            resolve(event.data);
          };
        });

        promises.push(promise);

        // actions.push({ message: `func-${y}-${x}`, func: calculateMoveMaxMinOutcome});
        // postActions.push({ message: `func-${y}-${x}`, args: [currValues, playerColor, val, y, x, depthIteration] })
        // promises.push(calculateMoveMaxMinOutcome(currValues, playerColor, val, y, x, depthIteration))
      } else {
        movesOutcomes[y][x] = calculateMoveMaxMinOutcome(currValues, playerColor, val, y, x, depthIteration)
      }
      // movesOutcomes[y][x] = calculateMoveMaxMinOutcome(currValues, playerColor, val, y, x, depthIteration)
    }
  }

  if (isEvenIteration(depthIteration)) {

    await Promise.all(promises)
      .then(function(data) {
        // `data` has the results, compute the final solution
        for (let y = 0; y < currValues.length; y++) {
          for (let x = 0; x < currValues[y].length; x++) {
            movesOutcomes[y][x] = data[(y*9) + x];
          }
        }
      });
  }

  return movesOutcomes
}


export const isEvenIteration = (n) => {
  return n % 2 == 0;
}