
window.minuu = {
  'start': __startMinuuInternal,
  'ready': function(callback){

  }
}

/**
 * Started function that can handle nothing, jquery object, or string selector
 * @param       {optional} $elm String, jQuery Object, or nothing
 * @constructor
 */
function __startMinuuInternal($elm){
  if($elm instanceof jQuery){
    loadContent($elm)
  }else
  if(typeof $elm == 'string'){
    loadContent($(selector))
  }else
  if(typeof $elm == 'undefined'){
    checkChildren($(document))
  }else{
    // TODO: throw error
  }
}

loadContent = function($elm, path = ''){

  // trigger elm.loadingStart
  sendEvent('loading', 'loading element through Minuu', $elm)

  let includeData = $($elm).data('include')

  if(includeData == undefined){
    console.warn('Minuu cannot start on an element without a data-include tag')
    return
  }

  if(path != ''){
    includeData = path.concat(includeData)
  }

  if(includeData.startsWith('folder:')){
    includeData = includeData.replace('folder:','').concat('/')
    path = path.concat(includeData)
    includeData = path.concat('index')
  }

  const file = `views/${includeData}.html`

  $($elm).load(file, function(responseText, textStatus, req){

    if(textStatus == 'success'){
      // trigger elm.loadingSuccess
      sendEvent('success', 'element loaded successfuly through Minuu', $elm)
    }
    else
    if(textStatus == 'error'){
      // trigger elm.loadingError
      sendEvent('error', 'element failed to load through Minuu', $elm)
    }

    // trigger elm.loadingComplete
    sendEvent('complete', 'element finished loading through Minuu', $elm)

    checkChildren($elm, path)
  })
}


checkChildren = function($elm, path){
  const children = $elm.find('[data-include]')
  children.each(function(){
    loadContent($(this), path)
  })
}

/**
 * sends events to document root
 * @param  {String} eventName name of event. will be prefixed with "minuu:"
 * @param  {String} eventMsg  descriptor for event. optional.
 * @param  {object} elm       Jquery DOM node that the event references
 * @return {event}            returns the dispatchEvent return.
 */
sendEvent = function(eventName, eventMsg = '', elm = {}){
    event = new CustomEvent(eventName, {msg: eventMsg, element: elm})
    return document.dispatchEvent(event)
}



// DONE: extract events into their own function
// DONE: extract loadContent into two separate functions,
//       one that loads, one that recurses. this way, start()
//       can call the recursion function and not worry about
//       iterating through children.
// TODO: finish logic for minuu.ready() using document.minuu:complete event
// TODO: check RXJS and promises to make sure the complete event
//       fires at the appropriate time after all async children
