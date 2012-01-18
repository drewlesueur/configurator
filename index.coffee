configs = """
  model
    eos
    gti
      option 1
      option 2
      option 3
      option 4
      option 5
    phaeton
    routan
    tiguan
    taureg
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
  ret =  objectStack[0] || currentObj
  console.log ret
  ret[0]





colorIndex = 0
colors = ["#C70B4C", "#F07100", "#FFC40F", "#7ABF0B", "#7ABF0B"]
getNextColor = () ->
  color = colors[colorIndex]
  colorIndex += 1
  if colorIndex >= colors.length
    colorIndex = 0
  color
  
zIndex = 1000
makeBall = (configs, el, oldBall)->
  if Array.isArray(configs)
    [first, options...] = configs
  else
    first = configs
    options = []
   
  ball = document.createElement("div")
  ball.style.zIndex = zIndex
  zIndex -= 1
  ball.style.position = "absolute"
  ball.style.top = "0"
  ball.style.left = "0"
  ball.style.display = "inline-block"
  ball.style.width = "40px"
  ball.style.height = "40px"
  ball.style.borderRadius = "40px"
  ball.style.backgroundColor = getNextColor()
  ball.style.webkitTransition = "all .25s linear"
  style = getComputedStyle(el)
  w = parseInt(style.width)
  h = parseInt(style.height)
  ball.centerTransform = "translate(#{w/2 - 20}px, #{h/2 - 20}px)"
  ball.style.webkitTransform = ball.centerTransform 
    
  ball.options = []   
  ball.onclick = (e) ->
    #hide old balls
    if oldBall
      for oldOption in oldBall.options
        do (oldOption) ->
          if oldOption != ball
            oldOption.style.opacity = 0
            oldOption.style.webkitTransform = """
              #{oldOption.centerTransform} #{oldOption.rotateTransform} translate(200px, 0)
            """
            setTimeout ->
              oldOption.style.display = "none"
              console.log "hiding #{ball.innerHTML}"
            , 250
      oldBall.style.opacity = 0
      setTimeout ->
        oldBall.style.display = "none"
      , 250

    #move to center
    ball.style.webkitTransform = """
      #{ball.centerTransform}
    """
    ball.oldonclick = ball.onclick
    ball.onclick = () -> #click again
      ball.onclick = ball.oldonclick
      #move ball back
      ball.style.webkitTransform = """
        #{ball.centerTransform} #{ball.rotateTransform} #{ball.radiusTransform}
      """

       
      #unhide old balls
      if oldBall
        for oldOption in oldBall.options
          do (oldOption)->
            if oldOption != ball
              oldOption.style.opacity = 1
              oldOption.style.display = "inline-block"
              oldOption.style.webkitTransition = "all 0.25s linear"
              setTimeout ->
                oldOption.style.webkitTransform = """
                  #{oldOption.centerTransform} #{oldOption.rotateTransform} #{oldOption.radiusTransform}
                """
              ,0
        oldBall.style.opacity = 1
        oldBall.style.display = "inline-block"
      
      #delete this level
      for option in ball.options
        do (option) ->
          option.style.webkitTransition = "all 0.25s linear"
          option.style.opacity = 0
          setTimeout ->
            option.style.display = "none"
          , 250
          option.style.webkitTransform = """
            #{ball.centerTransform}
          """

    len = options.length
    deg = 360 / len
    moveOptionBall = (optionBall, index) ->
      optionBall.style.opacity = 0
      optionBall.style.display = "inline-block"
      setTimeout ->
        optionBall.style.opacity = 1
        optionBall.style.display = "inline-block"
        optionBall.rotateTransform = " rotate(#{index * deg}deg) " 
        optionBall.radiusTransform = " translate(100px, 0) "
        optionBall.style.webkitTransform = """
          #{optionBall.centerTransform} #{optionBall.rotateTransform} #{optionBall.radiusTransform}
        """
      ,0

    if ball.options.length is 0 
      for option, index in options
        optionBall = makeBall option, el, ball
        moveOptionBall optionBall, index
        ball.options.push optionBall
    else
      for optionBall, index in ball.options
        moveOptionBall optionBall, index

  
  el.appendChild ball
  text = document.createTextNode(first)
  ball.appendChild text
  ball

makeUI = (configs, el) ->
  el ||= document.querySelector("#box")
  #remove all nodes
  if (el.hasChildNodes())
    while el.childNodes.length >= 1
      el.removeChild(el.firstChild)
  configs = parseConfigs configs
  ball = makeBall configs, el
window.makeUI = makeUI

window.onload = ->
  makeUI configs 


