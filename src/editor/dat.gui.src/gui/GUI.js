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

import css from '../utils/css';
import saveDialogueContents from './saveDialogue.html';
import ControllerFactory from '../controllers/ControllerFactory';
import Controller from '../controllers/Controller';
import BooleanController from '../controllers/BooleanController';
import FunctionController from '../controllers/FunctionController';
import NumberControllerBox from '../controllers/NumberControllerBox';
import NumberControllerSlider from '../controllers/NumberControllerSlider';
import ColorController from '../controllers/ColorController';
import requestAnimationFrame from '../utils/requestAnimationFrame';
import CenteredDiv from '../dom/CenteredDiv';
import dom from '../dom/dom';
import common from '../utils/common';
import styleSheet from './style.scss'; // CSS to embed in build
import OptionController from '../controllers/OptionController';

css.inject(styleSheet);

/** @ignore Outer-most className for GUI's */
const CSS_NAMESPACE = 'dg';

const HIDE_KEY_CODE = 72;

/** @ignore The only value shared between the JS and SCSS. Use caution. */
const CLOSE_BUTTON_HEIGHT = 20;

const DEFAULT_DEFAULT_PRESET_NAME = 'Default';

const SUPPORTS_LOCAL_STORAGE = (function() {
  try {
    return !!window.localStorage;
  } catch (e) {
    return false;
  }
}());

let SAVE_DIALOGUE;

/** @ignore Have we yet to create an autoPlace GUI? */
let autoPlaceVirgin = true;

/** @ignore Fixed position div that auto place GUI's go inside */
let autoPlaceContainer;

/** @ignore Are we hiding the GUI's ? */
let hide = false;

/** @private GUI's which should be hidden */
const hideableGuis = [];

/**
 * @class A lightweight controller library for JavaScript. It allows you to easily
 * manipulate variables and fire functions on the fly.
 *
 * @typicalname gui
 *
 * @example
 * // Creating a GUI with options.
 * var gui = new dat.GUI({name: 'My GUI'});
 *
 * @example
 * // Creating a GUI and a subfolder.
 * var gui = new dat.GUI();
 * var folder1 = gui.addFolder('Flow Field');
 *
 * @param {Object} [params]
 * @param {String} [params.name] The name of this GUI.
 * @param {Object} [params.load] JSON object representing the saved state of
 * this GUI.
 * @param {dat.gui.GUI} [params.parent] The GUI I'm nested in.
 * @param {Boolean} [params.autoPlace=true]
 * @param {Boolean} [params.hideable=true] If true, GUI is shown/hidden by <kbd>h</kbd> keypress.
 * @param {Boolean} [params.closed=false] If true, starts closed
 * @param {Boolean} [params.closeOnTop=false] If true, close/open button shows on top of the GUI
 */
const GUI = function(pars) {
  const _this = this;

  let params = pars || {};

  /**
   * Outermost DOM Element
   * @type {DOMElement}
   */
  this.domElement = document.createElement('div');
  this.__ul = document.createElement('ul');
  this.domElement.appendChild(this.__ul);

  dom.addClass(this.domElement, CSS_NAMESPACE);


  this.__disabled = false;
  this.__automations = {};
  this.__time = 0;
  this.__automationConfigUpdateFrequency = 5;
  this.__overviewFolders = [];

  /**
   * Nested GUI's by name
   * @ignore
   */

  
  this.__folders = {};

  this.__controllers = [];

  /**
   * List of objects I'm remembering for save, only used in top level GUI
   * @ignore
   */
  this.__rememberedObjects = [];

  /**
   * Maps the index of remembered objects to a map of controllers, only used
   * in top level GUI.
   *
   * @private
   * @ignore
   *
   * @example
   * [
   *  {
     *    propertyName: Controller,
     *    anotherPropertyName: Controller
     *  },
   *  {
     *    propertyName: Controller
     *  }
   * ]
   */
  this.__rememberedObjectIndecesToControllers = [];

  this.__listening = [];

  // Default parameters
  params = common.defaults(params, {
    closeOnTop: false,
    autoPlace: true,
    width: GUI.DEFAULT_WIDTH
  });

  params = common.defaults(params, {
    resizable: params.autoPlace,
    hideable: params.autoPlace
  });

  if (!common.isUndefined(params.load)) {
    // Explicit preset
    if (params.preset) {
      params.load.preset = params.preset;
    }
  } else {
    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
  }

  if (common.isUndefined(params.parent) && params.hideable) {
    hideableGuis.push(this);
  }

  // Only root level GUI's are resizable.
  params.resizable = common.isUndefined(params.parent) && params.resizable;

  if (params.autoPlace && common.isUndefined(params.scrollable)) {
    params.scrollable = true;
  }
//    params.scrollable = common.isUndefined(params.parent) && params.scrollable === true;

  // Not part of params because I don't want people passing this in via
  // constructor. Should be a 'remembered' value.
  let useLocalStorage =
    SUPPORTS_LOCAL_STORAGE &&
    localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';

  let saveToLocalStorage;
  let titleRow;

  Object.defineProperties(this,
    /** @lends GUI.prototype */
    {
      /**
       * The parent <code>GUI</code>
       * @type dat.gui.GUI
       */
      parent: {
        get: function() {
          return params.parent;
        }
      },

      scrollable: {
        get: function() {
          return params.scrollable;
        }
      },

      /**
       * Handles <code>GUI</code>'s element placement for you
       * @type Boolean
       */
      autoPlace: {
        get: function() {
          return params.autoPlace;
        }
      },

      /**
       * Handles <code>GUI</code>'s position of open/close button
       * @type Boolean
       */
      closeOnTop: {
        get: function() {
          return params.closeOnTop;
        }
      },

      /**
       * The identifier for a set of saved values
       * @type String
       */
      preset: {
        get: function() {
          if (_this.parent) {
            return _this.getRoot().preset;
          }

          return params.load.preset;
        },

        set: function(v) {
          if (_this.parent) {
            _this.getRoot().preset = v;
          } else {
            params.load.preset = v;
          }
          setPresetSelectIndex(this);
          _this.revert();
        }
      },

      /**
       * The width of <code>GUI</code> element
       * @type Number
       */
      width: {
        get: function() {
          return params.width;
        },
        set: function(v) {
          params.width = v;
          setWidth(_this, v);
        }
      },
      /**
       * The name of <code>GUI</code>. Used for folders. i.e
       * a folder's name
       * @type String
       */
      name: {
        get: function() {
          return params.name;
        },
        set: function(v) {
          // TODO Check for collisions among sibling folders¨
          params.name = v;
          if (titleRow) {
            titleRow.firstChild.nodeValue = params.name;
          }
        }
      },

      /**
       * Whether the <code>GUI</code> is collapsed or not
       * @type Boolean
       */
      closed: {
        get: function() {
          return params.closed;
        },
        set: function(v) {
          params.closed = v;
          if (params.closed) {
            dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
          } else {
            dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
          }
          // For browsers that aren't going to respect the CSS transition,
          // Lets just check our height against the window height right off
          // the bat.
          this.onResize();

        }
      },

      /**
       * Contains all presets
       * @type Object
       */
      load: {
        get: function() {
          return params.load;
        }
      },

      /**
       * Determines whether or not to use <a href="https://developer.mozilla.org/en/DOM/Storage#localStorage">localStorage</a> as the means for
       * <code>remember</code>ing
       * @type Boolean
       */
      useLocalStorage: {

        get: function() {
          return useLocalStorage;
        },
        set: function(bool) {
          if (SUPPORTS_LOCAL_STORAGE) {
            useLocalStorage = bool;
            if (bool) {
              dom.bind(window, 'unload', saveToLocalStorage);
            } else {
              dom.unbind(window, 'unload', saveToLocalStorage);
            }
            localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
          }
        }
      }
    });

  // Are we a root level GUI?
  if (common.isUndefined(params.parent)) {
    this.closed = params.closed || false;

    dom.addClass(this.domElement, GUI.CLASS_MAIN);
    dom.makeSelectable(this.domElement, false);

    // Are we supposed to be loading locally?
    if (SUPPORTS_LOCAL_STORAGE) {
      if (useLocalStorage) {
        _this.useLocalStorage = true;

        const savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));

        if (savedGui) {
          params.load = JSON.parse(savedGui);
        }
      }
    }
    // Oh, you're a nested GUI!
  } else {
    if (params.closed === undefined) {
      params.closed = true;
    }

    if(params.useTitleRow !== false) {
      
      const titleRowName = document.createTextNode(params.name);
      
      dom.addClass(titleRowName, 'controller-name');

      titleRow = addRow(_this, titleRowName);
      _this.title = titleRow;
      const onClickTitle = function(e) {
        e.preventDefault();
        _this.closed = !_this.closed;

        let traverse = (obj) => {
          obj.__controllers.forEach(c => {
            c.toggleOpen(true);
          });

          Object.values(obj.__folders).forEach(traverse);
        } 

        if (_this.closed) {
          traverse(_this);
        }
        


        return false;
      };

      dom.addClass(this.__ul, GUI.CLASS_CLOSED);
      
      // Create container for folder buttons
      const div = document.createElement("div");
      dom.addClass(div, "buttonContainer");
      titleRow.appendChild(div);

      // Move scene up and down buttons
      if(params.moveButtons) {
  
        const upIcon = document.createElement("span");
        const downIcon = document.createElement("span");

        this.downButton = document.createElement("button");
        div.appendChild(this.downButton);
        this.downButton.appendChild(downIcon);
        
        this.upButton = document.createElement("button");
        this.upButton.appendChild(upIcon);
        div.appendChild(this.upButton);

        dom.addClass(downIcon, 'downIcon');
        dom.addClass(upIcon, 'upIcon');
      }

      if (params.add) {
        const addIcon = document.createElement("span");
        this.addButton = document.createElement("button");
        this.addButtons.appendChild(addIcon);
        addIcon.style.color = "green";
        addIcon.innerHTML = "+";
        div.appendChild(this.addButton);
      } 

      if (params.remove) {
        const removeIcon = document.createElement("span");
        this.removeButton = document.createElement("button");
        this.removeButton.appendChild(removeIcon);
        removeIcon.innerHTML = "del";
        removeIcon.style.color = "red";
        div.appendChild(this.removeButton);
      }


      if (params.reset) {
        const reset = document.createElement("span");
        this.resetButton = document.createElement("button");
        this.resetButton.appendChild(reset);
        reset.innerHTML = "reset";
        reset.style.color = "white";
        div.appendChild(this.resetButton);

        this.resetButton.onclick = (event) => {
          event.preventDefault();
          event.stopPropagation();
          params.reset();
        }
      }
      

      dom.addClass(titleRow, 'title');
      dom.bind(titleRow, 'click', onClickTitle);
    }
    


    if (!params.closed) {
      this.closed = false;
    }
  }

  if (params.autoPlace) {
    if (common.isUndefined(params.parent)) {
      if (autoPlaceVirgin) {
        autoPlaceContainer = document.createElement('div');
        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
        dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer);
        autoPlaceVirgin = false;
      }

      // Put it in the dom for you.
      autoPlaceContainer.appendChild(this.domElement);

      // Apply the auto styles
      dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
    }


    // Make it not elastic.
    if (!this.parent) {
      setWidth(_this, params.width);
    }
  }

  this.__resizeHandler = function() {
    _this.onResizeDebounced();
  };

  dom.bind(window, 'resize', this.__resizeHandler);
  dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
  dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
  dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
  this.onResize();

  if (params.resizable) {
    addResizeHandle(this);
  }

  saveToLocalStorage = function() {
    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }
  };

  // expose this method publicly
  this.saveToLocalStorageIfPossible = saveToLocalStorage;

  function resetWidth() {
    const root = _this.getRoot();
    root.width += 1;
    common.defer(function() {
      root.width -= 1;
    });
  }

  if (!params.parent) {
    resetWidth();
  }
};

GUI.toggleHide = function() {
  hide = !hide;
  common.each(hideableGuis, function(gui) {
    gui.domElement.style.display = hide ? 'none' : '';
  });
};

GUI.CLASS_AUTO_PLACE = 'a';
GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI.CLASS_MAIN = 'main';
GUI.CLASS_CONTROLLER_ROW = 'cr';
GUI.CLASS_TOO_TALL = 'taller-than-window';
GUI.CLASS_CLOSED = 'closed';
GUI.CLASS_CLOSE_BUTTON = 'close-button';
GUI.CLASS_CLOSE_TOP = 'close-top';
GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI.CLASS_DRAG = 'drag';

GUI.DEFAULT_WIDTH = 245;
GUI.TEXT_CLOSED = 'Close Controls';
GUI.TEXT_OPEN = 'Open Controls';

GUI._keydownHandler = function(e) {
  if (document.activeElement.type !== 'text' &&
    (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
    GUI.toggleHide();
  }
};
dom.bind(window, 'keydown', GUI._keydownHandler, false);

common.extend(
  GUI.prototype,

  /** @lends GUI.prototype */
  {

    /**
     * Adds a new {@link Controller} to the GUI. The type of controller created
     * is inferred from the initial value of <code>object[property]</code>. For
     * color properties, see {@link addColor}.
     *
     * @param {Object} object The object to be manipulated
     * @param {String} property The name of the property to be manipulated
     * @param {Number} [min] Minimum allowed value
     * @param {Number} [max] Maximum allowed value
     * @param {Number} [step] Increment by which to change value
     * @returns {Controller} The controller that was added to the GUI.
     * @instance
     *
     * @example
     * // Add a string controller.
     * var person = {name: 'Sam'};
     * gui.add(person, 'name');
     *
     * @example
     * // Add a number controller slider.
     * var person = {age: 45};
     * gui.add(person, 'age', 0, 100);
     */
    add: function(object, property) {
      return add(
        this,
        object,
        property,
        {
          factoryArgs: Array.prototype.slice.call(arguments, 2),
          object:  Array.prototype.slice.call(arguments, 2)
        }
      );
    },

    addWithMeta: function(object, property, params, meta) {
      return add(
        this,
        object,
        property,
        {
          factoryArgs: Object.keys(params).map(k => params[k]),
          object:  Object.keys(params).map(k => params[k])
        },
        meta
      );
    },

    getAutomations: function() {
      const autos = this.getRoot().__automations;
      return Object.keys(autos).map(key => autos[key]);
    },

    toggleAdvancedMode: function(on) {

      this.__folders["Overview"].__controllers.forEach(c => c.hideRemoveButton(on));
      const f = this.__folders["Overview"].__folders; 
        Object.values(f).forEach(folder =>  {
          folder.__controllers.forEach(c => c.hideRemoveButton(on));
          folder.__hide(on);
        }
      )
    },

    
 
    addUndoItem: function(item) {
     
    },
    undo: function() {
    if(!this.__disabled) {

    }      
     
    },

    /**
     * Adds a new color controller to the GUI.
     *
     * @param object
     * @param property
     * @returns {Controller} The controller that was added to the GUI.
     * @instance
     *
     * @example
     * var palette = {
     *   color1: '#FF0000', // CSS string
     *   color2: [ 0, 128, 255 ], // RGB array
     *   color3: [ 0, 128, 255, 0.3 ], // RGB with alpha
     *   color4: { h: 350, s: 0.9, v: 0.3 } // Hue, saturation, value
     * };
     * gui.addColor(palette, 'color1');
     * gui.addColor(palette, 'color2');
     * gui.addColor(palette, 'color3');
     * gui.addColor(palette, 'color4');
     */
    addColor: function(object, property) {
      return add(
        this,
        object,
        property,
        {
          color: true
        }
      );
    },

    /**
     * Removes the given controller from the GUI.
     * @param {Controller} controller
     * @instance
     */
    remove: function(controller) {
      // TODO listening?
      this.__ul.removeChild(controller.__li);
      this.__controllers.splice(this.__controllers.indexOf(controller), 1);
      const _this = this;
      common.defer(function() {
        _this.onResize();
      });
    },

    /**
     * Removes the root GUI from the document and unbinds all event listeners.
     * For subfolders, use `gui.removeFolder(folder)` instead.
     * @instance
     */
    destroy: function() {
      if (this.parent) {
        throw new Error(
          'Only the root GUI should be removed with .destroy(). ' +
          'For subfolders, use gui.removeFolder(folder) instead.'
        );
      }

      if (this.autoPlace) {
        autoPlaceContainer.removeChild(this.domElement);
      }

      const _this = this;
      common.each(this.__folders, function(subfolder) {
        _this.removeFolder(subfolder);
      });

      dom.unbind(window, 'keydown', GUI._keydownHandler, false);

      removeListeners(this);
    },


  
    /**
     * Creates a new subfolder GUI instance.
     * @param name
     * @returns {dat.gui.GUI} The new folder.
     * @throws {Error} if this GUI already has a folder by the specified
     * name
     * @instance
     */
    addFolder: function(name, params = {}) {
      const { useTitleRow = true, moveButtons = false, before = null, remove = null, reset= null } = params;
      // We have to prevent collisions on names in order to have a key
      // by which to remember saved values
      

      let n = name;
      if (this.__folders[name] !== undefined) {
          const match = name.match(/\d+$/);
          if(match !== null) {
            const nr = parseInt(match[0], 10);
            n = name.split(match[0])[0]  + String(nr + 1);
          } else {
            n = name + " 2";
          } 
          

          /*
        throw new Error('You already have a folder in this GUI by the' +
          ' name "' + name + '"');*/
      }

      const newGuiParams = { 
        name: n, 
        parent: this, 
        useTitleRow: useTitleRow, 
        moveButtons: moveButtons, 
        remove: null,
        reset: reset,
      };

      // We need to pass down the autoPlace trait so that we can
      // attach event listeners to open/close folder actions to
      // ensure that a scrollbar appears if the window is too short.
      newGuiParams.autoPlace = this.autoPlace;

      // Do we have saved appearance data for this folder?
      if (this.load && // Anything loaded?
        this.load.folders && // Was my parent a dead-end?
        this.load.folders[n]) { // Did daddy remember me?
        // Start me closed if I was closed
        newGuiParams.closed = this.load.folders[n].closed;

        // Pass down the loaded data
        newGuiParams.load = this.load.folders[n];
      }

      const gui = new GUI(newGuiParams);
      this.__folders[n] = gui;

      if(moveButtons) {
        gui.downButton.onclick = (event) => {
          event.preventDefault();
          event.stopPropagation();
    
          if(gui.downFunction) {
            gui.downFunction();
          }
        }
    
        gui.upButton.onclick = (event) => {
          event.preventDefault();
          event.stopPropagation();
    
          if(gui.downFunction) {
            gui.upFunction();
          }
        }
      }
      
      if(!this.__root) {
        gui.__root = this;
      }else {
        gui.__root = this.__root;
      }
      const beforeLi = before ? before : null;
      const li = addRow(this, gui.domElement, beforeLi);      
      this.__folders[n].li = li;
      dom.addClass(li, 'folder');
      return gui;
    },

    /**
     * Removes a subfolder GUI instance.
     * @param {dat.gui.GUI} folder The folder to remove.
     * @instance
     */
    removeFolder: function(folder) {
      this.__ul.removeChild(folder.domElement.parentElement);

      delete this.__folders[folder.name];

      // Do we have saved appearance data for this folder?
      if (this.load && // Anything loaded?
        this.load.folders && // Was my parent a dead-end?
        this.load.folders[folder.name]) {
        delete this.load.folders[folder.name];
      }

      removeListeners(folder);

      const _this = this;

      common.each(folder.__folders, function(subfolder) {
        folder.removeFolder(subfolder);
      });

      common.defer(function() {
        _this.onResize();
      });
    },

    /**
     * Opens the GUI.
     */
    open: function() {
      this.closed = false;
    },

    /**
     * Closes the GUI.
     */
    close: function() {
      this.closed = true;
    },


    onResize: function() {
      // we debounce this function to prevent performance issues when rotating on tablet/mobile
      const root = this.getRoot();
      if (root.scrollable) {
        const top = dom.getOffset(root.__ul).top;
        let h = 0;

        common.each(root.__ul.childNodes, function(node) {
          if (!(root.autoPlace && node === root.__save_row)) {
            h += dom.getHeight(node);
          }
        });

        if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
          dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
          root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
        } else {
          dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
          root.__ul.style.height = 'auto';
        }
      }

      if (root.__resize_handle) {
        common.defer(function() {
          root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
        });
      }

    },

    onResizeDebounced: common.debounce(function() { this.onResize(); }, 50),

    /**
     * Mark objects for saving. The order of these objects cannot change as
     * the GUI grows. When remembering new objects, append them to the end
     * of the list.
     *
     * @param {...Object} objects
     * @throws {Error} if not called on a top level GUI.
     * @instance
     * @ignore
     */
    remember: function() {
      if (common.isUndefined(SAVE_DIALOGUE)) {
        SAVE_DIALOGUE = new CenteredDiv();
        SAVE_DIALOGUE.domElement.innerHTML = saveDialogueContents;
      }

      if (this.parent) {
        throw new Error('You can only call remember on a top level GUI.');
      }

      const _this = this;

      common.each(Array.prototype.slice.call(arguments), function(object) {
        if (_this.__rememberedObjects.length === 0) {
          addSaveMenu(_this);
        }
        if (_this.__rememberedObjects.indexOf(object) === -1) {
          _this.__rememberedObjects.push(object);
        }
      });

      if (this.autoPlace) {
        // Set save row width
        setWidth(this, this.width);
      }
    },

    /**
     * @returns {dat.gui.GUI} the topmost parent GUI of a nested GUI.
     * @instance
     */
    getRoot: function() {
      let gui = this;
      while (gui.parent) {
        gui = gui.parent;
      }
      return gui;
    },

    /**
     * @returns {Object} a JSON object representing the current state of
     * this GUI as well as its remembered properties.
     * @instance
     */
    getSaveObject: function() {
      const toReturn = this.load;
      toReturn.closed = this.closed;

      // Am I remembering any values?
      if (this.__rememberedObjects.length > 0) {
        toReturn.preset = this.preset;

        if (!toReturn.remembered) {
          toReturn.remembered = {};
        }

        toReturn.remembered[this.preset] = getCurrentPreset(this);
      }

      toReturn.folders = {};
      common.each(this.__folders, function(element, key) {
        toReturn.folders[key] = element.getSaveObject();
      });

      return toReturn;
    },

    save: function() {
      if (!this.load.remembered) {
        this.load.remembered = {};
      }

      this.load.remembered[this.preset] = getCurrentPreset(this);
      markPresetModified(this, false);
      this.saveToLocalStorageIfPossible();
    },

    saveAs: function(presetName) {
      if (!this.load.remembered) {
        // Retain default values upon first save
        this.load.remembered = {};
        this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
      }

      this.load.remembered[presetName] = getCurrentPreset(this);
      this.preset = presetName;
      addPresetOption(this, presetName, true);
      this.saveToLocalStorageIfPossible();
    },

    revert: function(gui) {
      common.each(this.__controllers, function(controller) {
        // Make revert work on Default.
        if (!this.getRoot().load.remembered) {
          controller.setValue(controller.initialValue);
        } else {
          recallSavedValue(gui || this.getRoot(), controller);
        }

        // fire onFinishChange callback
        if (controller.__onFinishChange) {
          controller.__onFinishChange.call(controller, controller.getValue());
        }
      }, this);

      common.each(this.__folders, function(folder) {
        folder.revert(folder);
      });

      if (!gui) {
        markPresetModified(this.getRoot(), false);
      }
    },

    listen: function(controller) {
      const init = this.__listening.length === 0;
      this.__listening.push(controller);
      if (init) {
        updateDisplays(this.__listening);
      }
    },

    updateDisplay: function() {
      common.each(this.__controllers, function(controller) {
        controller.updateDisplay();
      });
      common.each(this.__folders, function(folder) {
        folder.updateDisplay();
      });
    }
  }
);

/**
 * Add a row to the end of the GUI or before another row.
 *
 * @param gui
 * @param [newDom] If specified, inserts the dom content in the new row
 * @param [liBefore] If specified, places the new row before another row
 *
 * @ignore
 */
function addRow(gui, newDom, liBefore) {
  const li = document.createElement('li');
  if (newDom) {
    li.appendChild(newDom);
  
  }


  if (liBefore) {
    gui.__ul.insertBefore(li, liBefore);
   
  } else {
    gui.__ul.appendChild(li);
    

  }
  gui.onResize();
  return li;
}

function removeListeners(gui) {
  dom.unbind(window, 'resize', gui.__resizeHandler);

  if (gui.saveToLocalStorageIfPossible) {
    dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
  }
}

function markPresetModified(gui, modified) {
  const opt = gui.__preset_select[gui.__preset_select.selectedIndex];

  if (modified) {
    opt.innerHTML = opt.value + '*';
  } else {
    opt.innerHTML = opt.value;
  }
}

function augmentController(gui, li, controller) {
  controller.__li = li;
  controller.__gui = gui;
  

  common.extend(controller, /** @lends Controller.prototype */ {
    /**
     * @param  {Array|Object} options
     * @return {Controller}
     */
    options: function(options) {
      if (arguments.length > 1) {
        const nextSibling = controller.__li.nextElementSibling;
        controller.remove();

        return add(
          gui,
          controller.object,
          controller.property,
          {
            before: nextSibling,
            factoryArgs: [common.toArray(arguments)]
          }
        );
      }

      if (common.isArray(options) || common.isObject(options)) {
        const nextSibling = controller.__li.nextElementSibling;
        controller.remove();

        return add(
          gui,
          controller.object,
          controller.property,
          {
            before: nextSibling,
            factoryArgs: [options]
          }
        );
      }
    },

    /**
     * Sets the name of the controller.
     * @param  {string} name
     * @return {Controller}
     */
    name: function(name) {
      controller.__li.firstElementChild.firstElementChild.innerHTML = name;
      return controller;
    },

    /**
     * Sets controller to listen for changes on its underlying object.
     * @return {Controller}
     */
    listen: function() {
      controller.__gui.listen(controller);
      return controller;
    },

    /**
     * Removes the controller from its parent GUI.
     * @return {Controller}
     */
    remove: function() {
      controller.__gui.remove(controller);
      return controller;
    }
  });

  // All sliders should be accompanied by a box.
  if (controller instanceof NumberControllerSlider) {
    const box = new NumberControllerBox(controller.object, controller.property,
      { min: controller.__min, max: controller.__max, step: controller.__step });
      box.parent = controller.parent;
    common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max'], function(method) {
      const pc = controller[method];
      const pb = box[method];
      controller[method] = box[method] = function() {
        const args = Array.prototype.slice.call(arguments);
        pb.apply(box, args);
        return pc.apply(controller, args);
      };
    });

    dom.addClass(li, 'has-slider');
    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
  } else if (controller instanceof NumberControllerBox) {
    const r = function(returned) {
      // Have we defined both boundaries?
      if (common.isNumber(controller.__min) && common.isNumber(controller.__max)) {
        // Well, then lets just replace this with a slider.

        // lets remember if the old controller had a specific name or was listening
        const oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
        const wasListening = controller.__gui.__listening.indexOf(controller) > -1;

        controller.remove();
        const newController = add(
          gui,
          controller.object,
          controller.property,
          {
            before: controller.__li.nextElementSibling,
            factoryArgs: [controller.__min, controller.__max, controller.__step]
          });

        newController.name(oldName);
        if (wasListening) newController.listen();

        return newController;
      }

      return returned;
    };

    controller.min = common.compose(r, controller.min);
    controller.max = common.compose(r, controller.max);
  } else if (controller instanceof BooleanController) {
    dom.bind(li, 'click', function() {
      dom.fakeEvent(controller.__checkbox, 'click');
    });

    dom.bind(controller.__checkbox, 'click', function(e) {
      e.stopPropagation(); // Prevents double-toggle
    });
  } else if (controller instanceof FunctionController) {
    dom.bind(li, 'click', function() {
      dom.fakeEvent(controller.__button, 'click');
    });

    dom.bind(li, 'mouseover', function() {
      dom.addClass(controller.__button, 'hover');
    });

    dom.bind(li, 'mouseout', function() {
      dom.removeClass(controller.__button, 'hover');
    });
  } else if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
    controller.updateDisplay = common.compose(function(val) {
      li.style.borderLeftColor = controller.__color.toString();
      return val;
    }, controller.updateDisplay);

    controller.updateDisplay();
  }

  controller.setValue = common.compose(function(val) {
    if (gui.getRoot && gui.getRoot().__preset_select && controller.isModified()) {
      markPresetModified(gui.getRoot(), true);
    }

    return val;
  }, controller.setValue);
}

function recallSavedValue(gui, controller) {
  
  
  if(gui.getRoot && gui.getRoot().__rememberedObjects) {
    // Find the topmost GUI, that's where remembered objects live.
    const root = gui.getRoot();
     // Does the object we're controlling match anything we've been told to
  // remember?
    const matchedIndex = root.__rememberedObjects.indexOf(controller.object);

    // Why yes, it does!
    if (matchedIndex !== -1) {
      // Let me fetch a map of controllers for thcommon.isObject.
      let controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
  
      // Ohp, I believe this is the first controller we've created for this
      // object. Lets make the map fresh.
      if (controllerMap === undefined) {
        controllerMap = {};
        root.__rememberedObjectIndecesToControllers[matchedIndex] =
          controllerMap;
      }
  
      // Keep track of this controller
      controllerMap[controller.property] = controller;
  
      // Okay, now have we saved any values for this controller?
      if (root.load && root.load.remembered) {
        const presetMap = root.load.remembered;
  
        // Which preset are we trying to load?
        let preset;
  
        if (presetMap[gui.preset]) {
          preset = presetMap[gui.preset];
        } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
          // Uhh, you can have the default instead?
          preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
        } else {
          // Nada.
          return;
        }
  
        // Did the loaded object remember thcommon.isObject? &&  Did we remember this particular property?
        if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
          // We did remember something for this guy ...
          const value = preset[matchedIndex][controller.property];
  
          // And that's what it is.
          controller.initialValue = value;
          controller.setValue(value);
        }
      }
    }

  }
  

 
 
}

export function copyController(options) {
  if(options) {
    

    const item = options.item;
    const folders = item.parent.getRoot().__folders["Overview"]; 
    let g;
    let target = folders;
    if(options.location !== "root") {
      target = folders.__folders[options.location]
    }
  
    if(item instanceof OptionController) {
      g = target.add(item.object, item.property, item.__options);
    }else if(item instanceof ColorController) {
      g = target.addColor(item.object, item.property);
    }else if(item instanceof BooleanController || item instanceof Function) {
      g = target.add(item.object, item.property);
    } else {

      console.log(item.object)
      g = target.add(item.object, item.property, item.__min, item.__max, item.__step);
    }
    g.__onChange = item.__onChange; 
    g.__location = options.location;
    g.isSubController = true;
    g.master = item;
    g.disableAll();
    
    // Remove old buttons and add new
    var myNode = g.editGroup;
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

    const removeButton = document.createElement("button");
    removeButton.innerHTML = "R";
    removeButton.style.backgroundColor = "red";
    removeButton.style.color = "white";
    removeButton.style.marginLeft = "auto";
    removeButton.classList.add('controller-button');
    myNode.appendChild(removeButton);
    g.remove = () => {
      g.master.__subControllers = g.master.__subControllers.filter(e => e !== g);
      g.parent.remove(g);
    }
    removeButton.onclick = (event) => {
      event.stopPropagation();
      event.preventDefault();
      g.remove();
    }

    g.removeButton = removeButton;

    g.name(options.name);

    item.__subControllers.push(g);
  }
}

function add(gui, object, property, params, meta = {}) {
  if (object[property] === undefined) {
    throw new Error(`Object "${object}" has no property "${property}"`);
  }

  let controller, innerHTMLName;
  // very good code to use name instead of other thing
  if(params.factoryArgs && params.factoryArgs[0] && params.factoryArgs[0].name) {
      innerHTMLName = params.factoryArgs[0].name;

      if(params.factoryArgs.length === 1)
        params.factoryArgs[0] = undefined;
      else
        delete params.factoryArgs[0].name;
  }

  if (params.color || meta.color) {
    controller = new ColorController(object, property);
  } else {
    const factoryArgs = [object, property].concat(params.factoryArgs);
    controller = ControllerFactory.apply(gui, factoryArgs);
  }

  if (params.before instanceof Controller) {
    params.before = params.before.__li;
  }

  controller.getName = () => name.innerHTML;
  controller.parent = gui;
  controller.__name = property;

  recallSavedValue(gui, controller);

  dom.addClass(controller.domElement, 'c');

  const name = document.createElement('span');
  dom.addClass(name, 'property-name');

  name.innerHTML = innerHTMLName ? innerHTMLName : controller.property;
  const container = document.createElement('div');
  container.appendChild(name);
  container.appendChild(controller.domElement);

  let li;
  if(meta.first) {
    li = addRow(gui, container, gui.__ul.firstChild);
  }else if( meta.last) {
    li = addRow(gui, container, null);
  } else {
    li = addRow(gui, container, params.before);
  }

  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
  if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
  } else {
    dom.addClass(li, typeof controller.getValue());
  }

  augmentController(gui, li, controller);

  const editGroup = document.createElement('div');
  if(controller instanceof NumberControllerSlider || controller instanceof NumberControllerBox){
    const sd = document.createElement("button");
    sd.innerHTML = "A";
    sd.classList.add('controller-button');

    sd.onclick = () => {
      gui.__root.modalRef.toggleModal(11, true, {controller, property: meta.property});
    }
    controller.automationButton = sd;
    editGroup.appendChild(sd);
  }

  const addControllerToOverview = document.createElement("button");
  addControllerToOverview.innerHTML = "O";
  addControllerToOverview.style.marginLeft = "auto";
  addControllerToOverview.classList.add('controller-button');

  if (meta.parent) {
    controller.__parentObject = meta.parent;
  }

  if (meta.id) {
    controller.__uuid = meta.id;
  } 
  
  addControllerToOverview.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    gui.getRoot().modalRef.toggleModal(21, true, controller).then(copyController);
  }
  controller.toggleOpen = () => {};

  if (controller instanceof ColorController) {
    const sd = document.createElement("button");
    sd.innerHTML = "V";
    sd.classList.add('controller-button');
    /*
    
    const colorControllers = {};
    colorControllers.domElement = document.createElement("div");
    colorControllers.domElement.style.display = "flex";
    colorControllers.domElement.style.flexDirection = "column";
    colorControllers.onResize  = () => {};
    colorControllers.__root = gui.getRoot();
    colorControllers.__controllers  = [];
    colorControllers.folders  = [];
    

    colorControllers.__ul  = document.createElement('ul');

    const hueArgs = { factoryArgs: [0, 1], object:  [0, 1] }
    const rgbArgs = { factoryArgs: [0, 255, 1], object:  [0, 255, 1] }
    const buttonArgs = { factoryArgs: [], object:  [] }
    colorControllers.domElement.appendChild(colorControllers.__ul);

    controller.__useHue = add(colorControllers, controller, "useHue", buttonArgs).onChange(controller.enableUseHue);
    controller.__hue = add(colorControllers, controller, "hue", hueArgs, {property: "hue", parent: controller.__parentObject, id: controller.__uuid}).onChange(controller.setColor);
    controller.__saturation = add(colorControllers, controller, "saturation", hueArgs, {property: "saturation", parent: controller.__parentObject, id: controller.__uuid}).onChange(controller.setColor);
    controller.__useRGB = add(colorControllers, controller, "useRGB", buttonArgs).onChange(controller.enableUseRGB);
    controller.__red = add(colorControllers, controller, "red", rgbArgs, {property: "red", parent: controller.__parentObject, id: controller.__uuid}).onChange(controller.setColor);
    controller.__green = add(colorControllers, controller, "green", rgbArgs, {property: "green", parent: controller.__parentObject, id: controller.__uuid}).onChange(controller.setColor);
    controller.__blue = add(colorControllers, controller, "blue", rgbArgs, {property: "blue", parent: controller.__parentObject, id: controller.__uuid}).onChange(controller.setColor);


    
      const hue = document.createElement("button");
      const saturation = document.createElement("button");
      const red = document.createElement("button");
      const green = document.createElement("button");
      const blue = document.createElement("button");

      hue.innerHTML = "hue";
      saturation.innerHTML = "saturation";
      red.innerHTML = "red";
      green.innerHTML = "green";
      blue.innerHTML = "blue";

      colorControllers.appendChild(red);
      colorControllers.appendChild(green);
      colorControllers.appendChild(blue);
      colorControllers.appendChild(hue);
      colorControllers.appendChild(saturation);
   

    let open = false;
    let h = 28; 
    
    controller.toggleOpen = (forceClosed = null) => {
      open = !open;
      
      if (forceClosed === true) {
        open =  false;
      }

      if (open) {
        li.style.height = String(h * 8 + "px");
        containerContainer.appendChild(colorControllers.domElement);
      } else {
        li.style.height = "";
        if (colorControllers.domElement.parentNode === containerContainer) {
          containerContainer.removeChild(colorControllers.domElement);
        }
      
      }
    }

     */
    sd.onclick = () => {
      
        if (controller.__colorControllers.closed) {
          controller.__colorControllers.open();
        } else {
          controller.__colorControllers.close();
        }
    }

      controller.automationButton = sd;
      editGroup.appendChild(sd);

      
  }
  
  controller.overviewButton = addControllerToOverview;
  editGroup.appendChild(addControllerToOverview);
  controller.domElement.appendChild(editGroup);
  editGroup.style.display = "flex";
  editGroup.style.flexDirection = "row";
  editGroup.style.marginLeft = "auto";
  editGroup.style.minWidth = "52px";
  controller.editGroup = editGroup;


  gui.__controllers.push(controller);

  return controller;
}

function getLocalStorageHash(gui, key) {
  // TODO how does this deal with multiple GUI's?
  return document.location.href + '.' + key;
}

function addPresetOption(gui, name, setSelected) {
  const opt = document.createElement('option');
  opt.innerHTML = name;
  opt.value = name;
  gui.__preset_select.appendChild(opt);
  if (setSelected) {
    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
  }
}

function showHideExplain(gui, explain) {
  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
}

function addSaveMenu(gui) {
  const div = gui.__save_row = document.createElement('li');

  dom.addClass(gui.domElement, 'has-save');

  gui.__ul.insertBefore(div, gui.__ul.firstChild);

  dom.addClass(div, 'save-row');

  const gears = document.createElement('span');
  gears.innerHTML = '&nbsp;';
  dom.addClass(gears, 'button gears');

  // TODO replace with FunctionController
  const button = document.createElement('span');
  button.innerHTML = 'Save';
  dom.addClass(button, 'button');
  dom.addClass(button, 'save');

  const button2 = document.createElement('span');
  button2.innerHTML = 'New';
  dom.addClass(button2, 'button');
  dom.addClass(button2, 'save-as');

  const button3 = document.createElement('span');
  button3.innerHTML = 'Revert';
  dom.addClass(button3, 'button');
  dom.addClass(button3, 'revert');

  const select = gui.__preset_select = document.createElement('select');

  if (gui.load && gui.load.remembered) {
    common.each(gui.load.remembered, function(value, key) {
      addPresetOption(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
  }

  dom.bind(select, 'change', function() {
    for (let index = 0; index < gui.__preset_select.length; index++) {
      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
    }

    gui.preset = this.value;
  });

  div.appendChild(select);
  div.appendChild(gears);
  div.appendChild(button);
  div.appendChild(button2);
  div.appendChild(button3);

  if (SUPPORTS_LOCAL_STORAGE) {
    const explain = document.getElementById('dg-local-explain');
    const localStorageCheckBox = document.getElementById('dg-local-storage');
    const saveLocally = document.getElementById('dg-save-locally');

    saveLocally.style.display = 'block';

    if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
      localStorageCheckBox.setAttribute('checked', 'checked');
    }

    showHideExplain(gui, explain);

    // TODO: Use a boolean controller, fool!
    dom.bind(localStorageCheckBox, 'change', function() {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain(gui, explain);
    });
  }

  const newConstructorTextArea = document.getElementById('dg-new-constructor');

  dom.bind(newConstructorTextArea, 'keydown', function(e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE.hide();
    }
  });

  dom.bind(gears, 'click', function() {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
    SAVE_DIALOGUE.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });

  dom.bind(button, 'click', function() {
    gui.save();
  });

  dom.bind(button2, 'click', function() {
    const presetName = prompt('Enter a new preset name.');
    if (presetName) {
      gui.saveAs(presetName);
    }
  });

  dom.bind(button3, 'click', function() {
    gui.revert();
  });

  // div.appendChild(button2);
}

function addResizeHandle(gui) {
  let pmouseX;

  gui.__resize_handle = document.createElement('div');

  common.extend(gui.__resize_handle.style, {

    width: '6px',
    marginLeft: '-3px',
    height: '200px',
    cursor: 'ew-resize',
    position: 'absolute'
    // border: '1px solid blue'

  });

  function drag(e) {
    e.preventDefault();

    gui.width += pmouseX - e.clientX;
    gui.onResize();
    pmouseX = e.clientX;

    return false;
  }

  function dragStop() {
    dom.unbind(window, 'mousemove', drag);
    dom.unbind(window, 'mouseup', dragStop);
  }

  function dragStart(e) {
    e.preventDefault();

    pmouseX = e.clientX;

    dom.bind(window, 'mousemove', drag);
    dom.bind(window, 'mouseup', dragStop);

    return false;
  }

  dom.bind(gui.__resize_handle, 'mousedown', dragStart);

  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
}

function setWidth(gui, w) {
  gui.domElement.style.width = w + 'px';
  // Auto placed save-rows are position fixed, so we have to
  // set the width manually if we want it to bleed to the edge
  if (gui.__save_row && gui.autoPlace) {
    gui.__save_row.style.width = w + 'px';
  }

}

function getCurrentPreset(gui, useInitialValues) {
  const toReturn = {};

  // For each object I'm remembering
  common.each(gui.__rememberedObjects, function(val, index) {
    const savedValues = {};

    // The controllers I've made for thcommon.isObject by property
    const controllerMap =
      gui.__rememberedObjectIndecesToControllers[index];

    // Remember each value for each property
    common.each(controllerMap, function(controller, property) {
      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
    });

    // Save the values for thcommon.isObject
    toReturn[index] = savedValues;
  });

  return toReturn;
}

function setPresetSelectIndex(gui) {
  for (let index = 0; index < gui.__preset_select.length; index++) {
    if (gui.__preset_select[index].value === gui.preset) {
      gui.__preset_select.selectedIndex = index;
    }
  }
}

function updateDisplays(controllerArray) {
  if (controllerArray.length !== 0) {
    requestAnimationFrame.call(window, function() {
      updateDisplays(controllerArray);
    });
  }

  common.each(controllerArray, function(c) {
    c.updateDisplay();
  });
}

export default GUI;
