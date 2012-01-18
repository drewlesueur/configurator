(function() {
  var colorIndex, colors, configs, getNextColor, makeBall, makeUI, parseConfigs, zIndex,
    __slice = Array.prototype.slice;

  configs = "model\n  eos\n  gti\n    option 1\n    option 2\n    option 3\n    option 4\n    option 5\n  phaeton\n  routan\n  tiguan\n  taureg\n  jetta\n    color\n      silver\n      white\n    trim\n      black\n        leather\n        nonLeather\n      tan\n    comment\n    engine\n      1.8T\n      2.0\n      VR6\n  passat\n    color\n      maroon\n      beige\n    trim\n    engine\n      1.8T\n      2.0T\n        super turbo\n        pretty turbo\n  beetle";

  parseConfigs = function(configs) {
    var a, b, config, currentObj, currentSpaceLen, final, i, lastIndex, lastThingAdded, match, newCurrentObj, objectStack, ret, spaceLen, text, _i, _len, _ref;
    configs = configs.split("\n");
    final = {};
    currentSpaceLen = -2;
    currentObj = ["root"];
    lastThingAdded = "root";
    lastIndex = 0;
    objectStack = [currentObj];
    for (_i = 0, _len = configs.length; _i < _len; _i++) {
      config = configs[_i];
      match = config.match(/^(\s*)([^\s].*)/);
      if (!match) continue;
      if ((match != null ? match.length : void 0) < 3) continue;
      spaceLen = match[1].length / 2;
      text = match[2];
      if (spaceLen === currentSpaceLen) {
        currentObj.push(text);
        lastThingAdded = text;
        lastIndex = currentObj.length - 1;
      } else if (spaceLen > currentSpaceLen) {
        currentSpaceLen = spaceLen;
        newCurrentObj = [lastThingAdded];
        currentObj[lastIndex] = newCurrentObj;
        currentObj = newCurrentObj;
        currentObj.push(text);
        lastThingAdded = text;
        lastIndex = currentObj.length - 1;
        objectStack.push(currentObj);
      } else if (spaceLen < currentSpaceLen) {
        if (currentSpaceLen === 5 && spaceLen === 2) {
          a = 1;
          b = 1;
        }
        for (i = 0, _ref = currentSpaceLen - spaceLen; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          currentObj = objectStack.pop();
        }
        try {
          currentObj.push(text);
        } catch (e) {
          a = 1;
        }
        objectStack.push(currentObj);
        currentSpaceLen = spaceLen;
        lastThingAdded = text;
        lastIndex = currentObj.length - 1;
      }
    }
    window.os = objectStack;
    window.co = currentObj;
    ret = objectStack[0] || currentObj;
    console.log(ret);
    return ret[0];
  };

  colorIndex = 0;

  colors = ["#C70B4C", "#F07100", "#FFC40F", "#7ABF0B", "#7ABF0B"];

  getNextColor = function() {
    var color;
    color = colors[colorIndex];
    colorIndex += 1;
    if (colorIndex >= colors.length) colorIndex = 0;
    return color;
  };

  zIndex = 1000;

  makeBall = function(configs, el, oldBall) {
    var ball, first, h, options, style, text, w;
    if (Array.isArray(configs)) {
      first = configs[0], options = 2 <= configs.length ? __slice.call(configs, 1) : [];
    } else {
      first = configs;
      options = [];
    }
    ball = document.createElement("div");
    ball.style.zIndex = zIndex;
    zIndex -= 1;
    ball.style.position = "absolute";
    ball.style.top = "0";
    ball.style.left = "0";
    ball.style.display = "inline-block";
    ball.style.width = "40px";
    ball.style.height = "40px";
    ball.style.borderRadius = "40px";
    ball.style.backgroundColor = getNextColor();
    ball.style.webkitTransition = "all .25s linear";
    style = getComputedStyle(el);
    w = parseInt(style.width);
    h = parseInt(style.height);
    ball.centerTransform = "translate(" + (w / 2 - 20) + "px, " + (h / 2 - 20) + "px)";
    ball.style.webkitTransform = ball.centerTransform;
    ball.options = [];
    ball.onclick = function(e) {
      var deg, index, len, moveOptionBall, oldOption, option, optionBall, _fn, _i, _len, _len2, _len3, _ref, _ref2, _results, _results2;
      if (oldBall) {
        _ref = oldBall.options;
        _fn = function(oldOption) {
          if (oldOption !== ball) {
            oldOption.style.opacity = 0;
            oldOption.style.webkitTransform = "" + oldOption.centerTransform + " " + oldOption.rotateTransform + " translate(200px, 0)";
            return setTimeout(function() {
              oldOption.style.display = "none";
              return console.log("hiding " + ball.innerHTML);
            }, 250);
          }
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          oldOption = _ref[_i];
          _fn(oldOption);
        }
        oldBall.style.opacity = 0;
        setTimeout(function() {
          return oldBall.style.display = "none";
        }, 250);
      }
      ball.style.webkitTransform = "" + ball.centerTransform;
      ball.oldonclick = ball.onclick;
      ball.onclick = function() {
        var oldOption, option, _fn2, _j, _k, _len2, _len3, _ref2, _ref3, _results;
        ball.onclick = ball.oldonclick;
        ball.style.webkitTransform = "" + ball.centerTransform + " " + ball.rotateTransform + " " + ball.radiusTransform;
        if (oldBall) {
          _ref2 = oldBall.options;
          _fn2 = function(oldOption) {
            if (oldOption !== ball) {
              oldOption.style.opacity = 1;
              oldOption.style.display = "inline-block";
              oldOption.style.webkitTransition = "all 0.25s linear";
              return setTimeout(function() {
                return oldOption.style.webkitTransform = "" + oldOption.centerTransform + " " + oldOption.rotateTransform + " " + oldOption.radiusTransform;
              }, 0);
            }
          };
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            oldOption = _ref2[_j];
            _fn2(oldOption);
          }
          oldBall.style.opacity = 1;
          oldBall.style.display = "inline-block";
        }
        _ref3 = ball.options;
        _results = [];
        for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
          option = _ref3[_k];
          _results.push((function(option) {
            option.style.webkitTransition = "all 0.25s linear";
            option.style.opacity = 0;
            setTimeout(function() {
              return option.style.display = "none";
            }, 250);
            return option.style.webkitTransform = "" + ball.centerTransform;
          })(option));
        }
        return _results;
      };
      len = options.length;
      deg = 360 / len;
      moveOptionBall = function(optionBall, index) {
        optionBall.style.opacity = 0;
        optionBall.style.display = "inline-block";
        return setTimeout(function() {
          optionBall.style.opacity = 1;
          optionBall.style.display = "inline-block";
          optionBall.rotateTransform = " rotate(" + (index * deg) + "deg) ";
          optionBall.radiusTransform = " translate(100px, 0) ";
          return optionBall.style.webkitTransform = "" + optionBall.centerTransform + " " + optionBall.rotateTransform + " " + optionBall.radiusTransform;
        }, 0);
      };
      if (ball.options.length === 0) {
        _results = [];
        for (index = 0, _len2 = options.length; index < _len2; index++) {
          option = options[index];
          optionBall = makeBall(option, el, ball);
          moveOptionBall(optionBall, index);
          _results.push(ball.options.push(optionBall));
        }
        return _results;
      } else {
        _ref2 = ball.options;
        _results2 = [];
        for (index = 0, _len3 = _ref2.length; index < _len3; index++) {
          optionBall = _ref2[index];
          _results2.push(moveOptionBall(optionBall, index));
        }
        return _results2;
      }
    };
    el.appendChild(ball);
    text = document.createTextNode(first);
    ball.appendChild(text);
    return ball;
  };

  makeUI = function(configs, el) {
    var ball;
    el || (el = document.querySelector("#box"));
    if (el.hasChildNodes()) {
      while (el.childNodes.length >= 1) {
        el.removeChild(el.firstChild);
      }
    }
    configs = parseConfigs(configs);
    return ball = makeBall(configs, el);
  };

  window.makeUI = makeUI;

  window.onload = function() {
    return makeUI(configs);
  };

}).call(this);
