
/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @class An "abstract" class that represents a given property of an object.
 *
 * @param {Object} object The object to be manipulated
 * @param {string} property The name of the property to be manipulated
 */

import uuid from 'uuid/v4';
class Controller {
  constructor(object, property) {
    this.initialValue = object[property];
    this.preAutomationValue = object[property];
    this.previousValue = object[property];
    this.__uuid = uuid();
    this.__updateCounter = 0;
    this.__subControllers = [];
    this.__valueOptions = ["Value"];
    this.isSubController = false;

  
    /**
     * Those who extend this class will put their DOM elements in here.
     * @type {DOMElement}
     */
    this.domElement = document.createElement('div');


    /**
     * The object to manipulate
     * @type {Object}
     */
    this.object = object;

    /**
     * The name of the property to manipulate
     * @type {String}
     */
    this.property = property;

    /**
     * The function to be called on change.
     * @type {Function}
     * @ignore
     */
    this.__onChange = undefined;

    /**
     * The function to be called on finishing change.
     * @type {Function}
     * @ignore
     */
    this.__onFinishChange = undefined;
  }

  reset() {
    this.setValue(this.initialValue);
  }

  /**
   * Specify that a function fire every time someone changes the value with
   * this Controller.
   *
   * @param {Function} fnc This function will be called whenever the value
   * is modified via this Controller.
   * @returns {Controller} this
   */
  onChange(fnc) {
    
    this.__onChange = fnc;
    return this;
  }


  disableAutomations() {
    if(this.automationButton) {
      this.automationButton.style.display = "none";
    }
    return this;
  }

  disableOverview() {
    this.overviewButton.style.display = "none";
  }

  hideRemoveButton(hide) {
    
    if (this.removeButton) {
      if (!hide) {
        this.removeButton.style.display = "none";
      } else {
        this.removeButton.style.display = "inherit";
      }
    }
  }

  disableAll() {
    this.disableAutomations();
    this.disableOverview();
    return this;
  }

 

  /**
   * Specify that a function fire every time someone "finishes" changing
   * the value wih this Controller. Useful for values that change
   * incrementally like numbers or strings.
   *
   * @param {Function} fnc This function will be called whenever
   * someone "finishes" changing the value via this Controller.
   * @returns {Controller} this
   */
  onFinishChange(fnc) {
    this.__onFinishChange = fnc;

    
    return this;
  }

  /**
   * Change the value of <code>object[property]</code>
   *
   * @param {Object} newValue The new value of <code>object[property]</code>
   */

  undo(newValue, dontCallOnChange=false) {
    this.previousValue = this.object[this.property];
    this.object[this.property] = newValue;
    this.preAutomationValue = newValue;

    if (this.__onChange & !dontCallOnChange) {
      this.__onChange.call(this, newValue);
    }

    if( this.object.updateDisplay) {
      this.object.updateDisplay();
    }

      this.updateDisplay();
    return this;
  }
  __onFinishUndo(controller) {
    this.previousValue = this.object[this.property];
  }
  
  setValue(newValue, update=true) {
    
  
    this.object[this.property] = newValue;
    this.preAutomationValue = newValue;

    if (this.__onChange) {
      this.__onChange.call(this, newValue);
    }

    if( this.object.updateDisplay) {
      this.object.updateDisplay();
    }
    
    if(update) {
      this.__subControllers.forEach(c => c.setValue(newValue, false));
    } else {
      this.__subControllers.forEach(c => c.updateDisplay());
    }

    this.updateDisplay();
    return this;
  }

  /**
   * Gets the value of <code>object[property]</code>
   *
   * @returns {Object} The current value of <code>object[property]</code>
   */
  getValue() {
    return this.object[this.property];
  }

  /**
   * Refreshes the visual display of a Controller in order to keep sync
   * with the object's current value.
   * @returns {Controller} this
   */
  updateDisplay() {
    return this;
  }

  /**
   * @returns {Boolean} true if the value has deviated from initialValue
   */
  isModified() {
    return this.initialValue !== this.getValue();
  }
}

export default Controller;
