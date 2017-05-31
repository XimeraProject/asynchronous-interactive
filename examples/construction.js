define(['div', 'jquery', 'jsxgraph'], function(div, $, JXG) {
    var board = JXG.JSXGraph.initBoard(div.id, {boundingbox: [-5, 2, 5, -2]});
    
    var a = board.create('point',[0,1]);
    var b = board.create('point',[-1,0]);
    var c = board.create('point',[-3,-1]);
    var d = board.create('point',[2,-1]);    

    var lineAB = board.create('line',[a,b]);
    var lineCD = board.create('line',[c,d]);    

    board.create('intersection',[lineAB,lineCD]);
});
