import { Scenario } from './scenario.model';
import { DATA_FORCINGS } from '../data/forcings.data';
import { DATA_CONSTANTS } from '../data/constants.data';

export class Simulation {
  scenario: Scenario;

  private _forcings;
  private _constants;
  runComplete: boolean = false;

  runInput;
  runOutput;

  constructor(
    private _scenario: Scenario
  ) {
    this.scenario = JSON.parse(JSON.stringify(_scenario));
  }

  get hasOutput() {
    return (typeof this.runOutput !== 'undefined' && this.runOutput);
  }

  get isRunComplete() {
    return (this.runComplete && this.hasOutput);
  }

  get isModified() {
    return (
      (typeof this._forcings !== 'undefined' && this._forcings)
      || (typeof this._constants !== 'undefined' && this._constants)
      );
  }

  doRevertRun() {
    this.runComplete = false;
    this.runOutput = false;
  }

  forcingConfig(key: string) {

    const forcingMeta = DATA_FORCINGS[key];
    const scenarioYearStart = this.scenario.range.start;
    const scenarioYearEnd = this.scenario.range.end;

    let config;

    // Check local simulation._forcings
    if (typeof this._forcings !== 'undefined' && typeof this._forcings[key] !== 'undefined' && this._forcings[key]) {

      config = JSON.parse(JSON.stringify(this._forcings[key]));

    // Else try simulation.scenario
    } else if (typeof this.scenario['forcings'] !== 'undefined' && typeof this.scenario['forcings'][key] !== 'undefined' && this.scenario['forcings'][key]) {

      config = JSON.parse(JSON.stringify(this.scenario['forcings'][key]));
      config.data = null;

      if (typeof config.isEnabled === 'undefined') {
        config.isEnabled = true;
      }

    // Fallback to default
    } else {

      config = {
        isEnabled: forcingMeta.default.isEnabled,
        data: null
      }
    }

    if (key === 'internalVariability') {
      return config;
    }

    if (typeof config.nodesCount !== 'number' || !config.isEnabled) {
      config.nodesCount = 0;
    }

    return config;
  }

  modifyForcingConfig(key: string, forcing) {

    if (typeof this._forcings === 'undefined') {
      this._forcings = {};
    }

    if (typeof forcing === 'undefined' || !forcing) {
      this._forcings[key] = false;
    } else {
      this._forcings[key] = JSON.parse(JSON.stringify(forcing));
    }
  }

  get forcingConfigs() {
    let forcings = {};
    for (let key in DATA_FORCINGS) {
      forcings[key] = this.forcingConfig(key);
    }
    return forcings;
  }



  get constants() {

    if (typeof this._constants !== 'undefined') {
      return JSON.parse(JSON.stringify(this._constants));
    }

    if (typeof this.scenario.constants !== 'undefined') {
      return JSON.parse(JSON.stringify(this.scenario.constants));
    }

    return JSON.parse(JSON.stringify(DATA_CONSTANTS));
  }

  modifyConstants(values) {

    if (values === false) {
      this._constants = undefined;
      return;
    }

    const existingConstants = this.constants;
    let newConstants = {};

    for (let key in existingConstants) {

      if (typeof values[key] === 'undefined') {
        newConstants[key] = existingConstants[key];
      } else {
        if (values[key] === existingConstants[key]) {
          newConstants[key] = existingConstants[key];
        } else {
          newConstants[key] = values[key];
        }
      }
    }

    this._constants = newConstants;
  }




  // binary search implementation. returns index of searchElement in arr
  // if not found, returns (-insertionPoint - 1) where insertionPoint is the position
  // in the array the element would be inserted
  binarySearch(arr, searchElement) {
    let minIndex = 0;
    let maxIndex = arr.length - 1;
    let currentIndex;
    let currentElement;
    while (minIndex <= maxIndex) {
      currentIndex = (minIndex + maxIndex) / 2 | 0;
      currentElement = arr[currentIndex];

      if (Math.abs(currentElement - searchElement) <= Number.EPSILON) {
        return currentIndex;
      } else if (currentElement < searchElement) {
        minIndex = currentIndex + 1;
      } else if (currentElement > searchElement) {
        maxIndex = currentIndex - 1;
      }
    }
    let insertionPoint = Number.NaN;
    while (currentIndex < arr.length) {
      if (arr[currentIndex] > searchElement) {
        insertionPoint = currentIndex;
        break;
      }
      currentIndex++;
    }
    if (isNaN(insertionPoint)) {
      insertionPoint = arr.length;
    }
    return (-insertionPoint - 1);
  };

  // linear interpolation
  interpolate(x, y, xi) {
    let slope = [];
    let intercept = [];

    // calculate the line equation (i.e. slope and intercept) between each point
    for (let i = 0; i < x.length - 1; i++) {
      const dx = x[i + 1] - x[i];
      const dy = y[i + 1] - y[i];
      slope[i] = dy / dx;
      intercept[i] = y[i] - x[i] * slope[i];
    }

    // perform the interpolation
    let yi = [];
    for (let i = 0; i < xi.length; i++) {
      if (xi[i] > x[x.length - 1] || xi[i] < x[0]) {
        yi[i] = Number.NaN;
      } else {
        let loc = this.binarySearch(x, xi[i]); // binary search
        if (loc < -1) {
          loc = -loc - 2;
          yi[i] = slope[loc] * xi[i] + intercept[loc];
        } else {
          yi[i] = y[loc];
        }
      }
    }

    return yi;
  };

  // Generate new array of years
  generateYears(start, end, step){
    const years = [];
    step = step || 1;

    for (let i = start; i <= end + 0.49; i += step) {
      years.push(Math.round(i));
    }

    return years;
  }




  pow = Math.pow;
  sqrt = Math.sqrt;
  log = Math.log;
  cos = Math.cos;

  // log 10 function, which some browsers (older browsers + all Internet Explorer versions) don't support
  log10 = Math.log10 || function(x) {
    return Math.log(x) / Math.LN10;
  };

  // square function for cleaner calculations in the model code
  square(number: number) {
    return this.pow(number, 2);
  }

  // rounds the given number to the given number of decimal places
  round(number, places) {
    return +(Math.round(+(number + 'e+' + places)) + 'e-' + places);
  };

  // returns a new array with values equivalent to Matlab term 'start:interval:end'
  interpC(start, interval, end) {
    const denominator = Math.round(1 / interval);
    const array = [];

    for (let i = start; i < end; i++) {
      for (let j = 0; j < denominator; j++) {
        array.push(i + (j * interval));
      }
    }
    array.push(end); // end can't be included in above for loop because of how the inner loop works

    return array;
  };

  // mean ignoring NaN values
  nanmean(array) {
    let total = 0;
    let nums = 0;
    for (let i = 0; i < array.length; i++) {
      if (!isNaN(array[i])) {
        total += array[i];
        nums++;
      }
    }
    return (total / nums);
  };

  // mean ignoring non-zero values
  nonZeroMean(array) {
    let total = 0;
    let nums = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] != 0 && !isNaN(array[i])) {
        total += array[i];
        nums++;
      }
    }
    return (total / nums);
  };

  // generates a random number
  // right now this function just generates 4 random numbers between 0 and 3 and chooses the smallest one
  // positive or negative is then randomly generated and tacked on before returning
  randn() {
    const a = Math.random() * 3;
    const b = Math.random() * 3;
    const c = Math.random() * 3;
    const d = Math.random() * 3;
    let num = Math.min(Math.min(a, b), Math.min(c, d));
    if (Math.random() >= 0.5) { // ~50% chance of negative
      num = -num;
    }
    return num;
  };

  // subjects all numbers in the array by the first index
  // for use before plotting (in simulate.js) for Cat, Cup, Clo, etc...
  subtractByFirstIndex(array) {
    const first = array[0];
    for (let i = 0; i < array.length; i++) {
      array[i] -= first;
    }
    return array;
  };

  // multiplies all elements in the given array by the given value
  multiplyAllBy(array, by) {
    for (let i = 0; i < array.length; i++) {
      array[i] *= by;
    }
    return array;
  };

  /// END OF MATH-related functions

  // checks whether or not the given parameter is a valid year
  isValidYear(year, maxYear) {
    if (year === '') return false;
    if (isNaN(year)) return false;
    year = Number(year);
    if ((year % 1) !== 0) return false;
    if (year < 0 || year > maxYear) return false;

    return true;
  };

  // returns a deep copy of the array (no references)
  arrcpy(original) {
    const newArray = [];
    for (let i = 0; i < original.length; i++) {
      newArray[i] = original[i];
    }
    return newArray;
  };

  // returns the first index of the given array which contains the given needle to search for
  arrfind(haystack, needle) {
    for (let i = 0; i < haystack.length; i++) {
      if (haystack[i] == needle) {
        return i;
      }
    }
    throw new Error(needle + ' was not found in haystack, this should not happen');
  };

  // returns a deep copy of the given object via JSON functions
  objcpy(original) {
    return JSON.parse(JSON.stringify(original));
  };

  // creates an array of specified length, all with thhe given value
  createAndFillArray(length, value) {
    const ret = [];
    for (let i = 0; i < length; i++) {
      ret[i] = value;
    }
    return ret;
  };

  // checks whether all the arrays within the given array all have equal length
  arrLensEqual(twoDimArray) {
    if (twoDimArray.length < 2) {
      throw new Error('Param given to arrLensEqual() only has ' + twoDimArray.length + ' element(s).');
    }
    const len = twoDimArray[0].length;
    for (let i = 1; i < twoDimArray.length; i++) {
      if (twoDimArray[i].length !== len) {
        return false;
      }
    }
    return true;
  };

  // Function to reduce array of data. Reduce data based on step.
  reduceData(data, step){
    const newDataArray = [];

    for (let i = 0; i < data.length; i += step) {
      newDataArray.push(data[i]);
    }

    return newDataArray;
  }

  /**
   * Reduces the number of points in a dataset. This greatly increases the responsiveness of the viewport thread (plotting over
   * 5,000 points on a Chartist chart lags the framerate).
   *
   * Reduction is done by only preserving every x-th value, where x denotes the number of original values divided by GOAL_POINTS.
   */
  reducePoints(original, goalPoints = undefined) {
    if (typeof goalPoints === 'undefined')
      goalPoints = 500; // number of points in the result

    let result = []; // the array that will be returned
    let x = original.length / goalPoints;
    if (x < 2) {
      // just return original, no reductions required
      return original;
    }
    for (let i = 0; i < goalPoints; i++) {
      // set result[i] to the closest corresponding index in original
      result[i] = original[Math.round(i * x)];
    }
    return result;
  };

  reverseInterpC(data, interval) {
    const denominator = Math.round(1 / interval);
    const array = [];
    const end = data[data.length - 1];

    for (let i = 0; i < data.length - 2; i++) {
      if (i % denominator === 0) {
        array.push(data[i]);
      }
    }

    array.push(end);
    return array;
  };

}
