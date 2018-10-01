$(document).ready(()=>{

  window.minuu = {
    'start': function(){
      $('[data-include]').each(function(){
        loadContent($(this));
      });
    },
    'startOnElm': function($elm){
      loadContent($elm);
    },
    'startOnSelector': function(selector){
      loadContent($(selector));
    }
  };
});


loadContent = function($elm, path = ''){
  let includeData = $($elm).data('include')

  if(includeData == undefined){
    console.warn('Minuu cannot start on an element without a data-include tag');
    return;
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
  $($elm).load(file, function(){
    const children = $elm.find('[data-include]')
    children.each(function(){
      loadContent($(this), path)
    })
  })
}
