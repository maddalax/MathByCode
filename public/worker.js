let logs = [];

onmessage = function(e) {
  try {
    const result = eval(e.data);
    if(result != null && result.toString().length > 0) {
      console.log(result)
    }
    postMessage(JSON.stringify({
      type: 'eval:result',
      payload: result
    }));
  } catch(ex) {
    console.error(ex);
    postMessage(JSON.stringify({
      type: 'editor:eval:failure',
      payload: ex.message
    }));
  }
}

console.log = function() {
  logs.push({
    message: Array.from(arguments).join(", "),
    type: 'normal'
  });
};

console.error = function() {
  logs.push({
    message: Array.from(arguments).join(", "),
    type: 'error'
  });
};

console.info = function() {
  logs.push({
    message: Array.from(arguments).join(", "),
    type: 'info'
  });
};

console.warn = function() {
  logs.push({
    message: Array.from(arguments).join(", "),
    type: 'warn'
  });
};

setInterval(() => {
  if(logs.length === 0) {
    return;
  }
  postMessage(JSON.stringify({
    type: 'console:log',
    payload: logs
  }))
  logs = []
}, 100)