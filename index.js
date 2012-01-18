(function() {
  var configs, parseConfigs;

  configs = "car\n  jetta\n  passat\n    deeper for\nboat\n  someting\n  someting\n";

  configs = "car\n  model\n    jetta\n      color\n        silver\n        white\n      trim\n        black\n          leather\n          nonLeather\n        tan\n      comment\n      engine\n        1.8T\n        2.0\n        VR6\n    passat\n      color\n        maroon\n        beige\n      trim\n      engine\n        1.8T\n        2.0T\n          super turbo\n          pretty turbo\n    beetle";

  parseConfigs = function(configs) {
    var a, b, config, currentObj, currentSpaceLen, final, i, lastIndex, lastThingAdded, match, newCurrentObj, objectStack, spaceLen, text, _i, _len, _ref;
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
    return objectStack[0] || currentObj;
  };

  console.log(parseConfigs(configs));

}).call(this);
