configs = """
  car
    jetta
    passat
      deeper for
  boat
    someting
    someting

"""

configs = """
  car
    model
      jetta
        color
          silver
          white
        trim
          black
            leather
            nonLeather
          tan
        comment
        engine
          1.8T
          2.0
          VR6
      passat
        color
          maroon
          beige
        trim
        engine
          1.8T
          2.0T
            super turbo
            pretty turbo
      beetle
"""

parseConfigs = (configs) ->
  configs = configs.split "\n"
  final = {}
  currentSpaceLen = -2
  currentObj = ["root"]
  lastThingAdded = "root"
  lastIndex = 0
  objectStack = [currentObj]
  for config in configs
    match = config.match /^(\s*)([^\s].*)/ 
    if not match
      continue
    if match?.length < 3
      continue
    spaceLen = match[1].length / 2
    text = match[2]
    if spaceLen is currentSpaceLen
      currentObj.push text
      lastThingAdded = text
      lastIndex = currentObj.length - 1
    else if spaceLen > currentSpaceLen
      currentSpaceLen = spaceLen
      newCurrentObj = [lastThingAdded]
      currentObj[lastIndex] = newCurrentObj
      currentObj = newCurrentObj
      currentObj.push text
      lastThingAdded = text
      lastIndex = currentObj.length - 1
      objectStack.push currentObj
    else if spaceLen < currentSpaceLen
      if currentSpaceLen is 5 and spaceLen is 2
        a = 1
        b = 1
      for i in [0..currentSpaceLen - spaceLen]
        currentObj = objectStack.pop()
      try
        currentObj.push text
      catch e
        a = 1
      objectStack.push currentObj
      currentSpaceLen = spaceLen
      lastThingAdded = text
      lastIndex = currentObj.length - 1
  window.os = objectStack
  window.co = currentObj
  return objectStack[0] || currentObj


console.log parseConfigs configs
