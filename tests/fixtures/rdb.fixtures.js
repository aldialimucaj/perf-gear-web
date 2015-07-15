r.db('dev').table('measurements').insert([{
              path: 'measurements/tests/get/id/6',
  typeId: 1,
  type:'HIT',
  hitValue: 53,
  unit: 'ms',
  sequence: [
    {"timestamp":1436891558967,"value":0.00, tag: "Start"},
    {"timestamp":1436891558969,"value":0.00, tag: "fun1"},
    {"timestamp":1436891558975,"value":0.00, tag: "fun2"},
    {"timestamp":1436891558987,"value":0.00, tag: "fun3"},
    {"timestamp":1436891558993,"value":0.00, tag: "End"}]
}])

r.db('dev').table('measurements').insert([{
              path: 'measurements/tests/ram/id/6',
  typeId: 2,
  type:'RAM',
  hitValue: 53,
  unit: 'kb',
  sequence: [
    {"timestamp":1436891558967,"value":1.20, tag: "Start"},
    {"timestamp":1436891558969,"value":2.30, tag: "fun1"},
    {"timestamp":1436891558975,"value":1.70, tag: "fun2"},
    {"timestamp":1436891558987,"value":1.85, tag: "fun3"},
    {"timestamp":1436891558993,"value":1.50, tag: "End"}]
}])
