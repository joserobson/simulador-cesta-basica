import React, { Component } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PopupboxManager, PopupboxContainer } from "react-popupbox";
import "react-popupbox/dist/react-popupbox.css";

const grid = 2;

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`,
  }));

const produtos = [
  { id: "1", content: "Feijão", ehCestaBasica: true, img: "feijao.png" },
  { id: "2", content: "Arroz", ehCestaBasica: true, img: "arroz.png" },
  { id: "3", content: "Sal", ehCestaBasica: true, img: "sal.png" },
  { id: "4", content: "Açúcar", ehCestaBasica: true, img: "acucar.png" },
  { id: "5", content: "Macarrão", ehCestaBasica: true, img: "macarrao.png" },
  {
    id: "6",
    content: "Massa de Tomate",
    ehCestaBasica: true,
    img: "massaTomate.png",
  },
  { id: "7", content: "Óleo", ehCestaBasica: true, img: "oleo.png" },
  { id: "8", content: "Café", ehCestaBasica: true, img: "cafe.png" },
  { id: "9", content: "Fubá", ehCestaBasica: true, img: "fuba.png" },
  { id: "10", content: "Bolacha", ehCestaBasica: true, img: "bolacha.png" },
  { id: "11", content: "Bombom", ehCestaBasica: false, img: "bombom.png" },
  {
    id: "12",
    content: "Refrigerante",
    ehCestaBasica: false,
    img: "refrigerante.png",
  },
  { id: "13", content: "Shampoo", ehCestaBasica: false, img: "shampoo.png" },
  {
    id: "14",
    content: "Amaciante",
    ehCestaBasica: false,
    img: "amaciante.png",
  },
  { id: "15", content: "Danone", ehCestaBasica: false, img: "danone.png" },
];

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const getListStyle = (isDraggingOver, float) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: "60%",
  float: float,
  height: "480px",
});

const getCarrinhoListStyle = (isDraggingOver, float, img) => ({
  //background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: "38%",
  float: float,
  height: "430px",
  //backgroundImage:'url(../imgs/carrinhoCompras.png)',
  backgroundImage: `url(../imgs/${img})`,
  marginTop: "30px",
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // backgroundImage:'url(../imgs/arroz.png)',
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getItemCarrinhoStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  height: '30px',

  // change background colour if dragging
  //background: isDragging ? "lightgreen" : "grey",

  //backgroundImage:'url(../imgs/carrinhoCompras.png)',
  // styles we need to apply on draggables
  ...draggableStyle,
});

const popupboxConfig = {
  titleBar: {
    enable: true,
    text: "ATENÇÃO",
  },
  fadeIn: true,
  fadeInSpeed: 500,
};

const tempoDeJogoSegundos = 60;
const tempoDeJogoMinutos = 1;

class App extends Component {

  state = {
    items: produtos,
    selected: [],
    backgroundImage: "carrinhoCompras.png",
    iniciarJogo: false,
    totalDePontos: 0,
    segundos:tempoDeJogoSegundos,
    minutos:tempoDeJogoMinutos,
    tempoEsgotado:false
  };
  

  openPopupbox(mensagem) {
    const content = (
      <div>
        <span className="quotes-from">{mensagem}</span>
      </div>
    );
    PopupboxManager.open({ content });
  }

  id2List = {
    droppable: "items",
    droppable2: "selected",
  };

  getList = (id) => this.state[this.id2List[id]];

  onDragEnd = (result) => {
    const { source, destination } = result;

    if (source.droppableId === "droppable2") {
      return;
    }

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state = { items };

      if (source.droppableId === "droppable2") {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      var produto = this.getList(source.droppableId)[source.index];
      if (!produto.ehCestaBasica) {
        this.openPopupbox(
          "O PRODUTO " +
            produto.content.toUpperCase() +
            " NÃO PERTENCE À CESTA BÁSICA!"
        );

        this.setState({
          totalDePontos: this.state.totalDePontos - 5
        });

        return;
      }


      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      let img = `carrinhoCompras${this.getList(destination.droppableId).length + 1}Produto.png`;

      let tempoEsgotado = false;
      if (result.droppable2.length === 10){
        tempoEsgotado = true;
      }  

      this.setState({
        items: result.droppable,
        selected: result.droppable2,
        backgroundImage: img,
        totalDePontos: this.state.totalDePontos + 5,
        tempoEsgotado: tempoEsgotado
      });
    }
  };

  jogar =() =>{
   
    this.setState({
      iniciarJogo: true
    });
  }

  reiniciarJogo =() =>{
   
    this.setState({
      backgroundImage: "carrinhoCompras.png",
      iniciarJogo: true,
      totalDePontos: 0,
      segundos:tempoDeJogoSegundos,
      minutos:tempoDeJogoMinutos,
      tempoEsgotado:false,
      items: produtos,
      selected: []
    });
  }

  componentDidMount(){


    this._interval = setInterval(() => {
                
      if (this.state.segundos >= 0 && this.state.minutos >= 0 && this.state.iniciarJogo === true)
      {
        let segundos = this.state.segundos - 1;
        let minutos = this.state.minutos;
        if (segundos === 0 && minutos > 0)
        {
          minutos = minutos - 1;
          segundos = 59;
        }

        if (segundos < 0 ){
          this.setState({
            segundos: 0,
            minutos: 0,
            tempoEsgotado:true
          });

        }else{
          this.setState({
            segundos: segundos,
            minutos: minutos
          });
        }
      }

    }, 1000);
  }

  render() {    

    const numeroColunas = 5;

    let linhas = [];
    let colunas = [];
    for (let index = 0; index < this.state.items.length; index++) {
      const element = this.state.items[index];

      if (colunas.length === numeroColunas) {
        linhas.push(colunas);
        colunas = [];
      }

      colunas.push(element);
    }
    linhas.push(colunas);

    return (
      <div>
        <PopupboxContainer {...popupboxConfig} />

        { !this.state.iniciarJogo && !this.state.tempoEsgotado &&
          <div id="prepararJogo" style={{textAlign:"center", paddingTop:'10px'}}>
            <h1>PREPARADO(A) PARA AS COMPRAS?</h1>            
            <h2>VOCÊ TEM 2 MINUTOS PRA SELECIONAR SOMENTE OS PRODUTOS DA CESTA BÁSICA.</h2>            
            <h1>BOAS COMPRAS!</h1>
            <div style={{float:"left", width:"50%"}}>
              <img src="../imgs/fundoPaginaInicial.png"></img>
            </div>
            <div style={{float:"right", width:"50%", paddingTop:'100px'}}>
                <button className="btnJogar" onClick={this.jogar}>Jogar</button>  
            </div>
            
          </div>
        }

        {this.state.tempoEsgotado &&
          <div id="resultadoJogo" style={{textAlign:"center"}}>
          <h2>FIM DE JOGO</h2> 
          <div style={{float:"left", width:"50%"}}>
              <img src="../imgs/fundoPaginaInicial.png"></img>
          </div>
          <div style={{float:"right", width:"50%", paddingTop:"100px"}}>         
            <h2>VOCÊ FEZ {this.state.totalDePontos} PONTOS</h2>          
          </div>
          <button className="btnJogar" onClick={this.reiniciarJogo}>Jogar Novamente</button>
        </div>        
        }


        {this.state.iniciarJogo && !this.state.tempoEsgotado &&
        <div id="jogo">
          <div style={{ textAlign: "center", width: '60%', float:"left" }}>
            <h2>Selecione e arraste os produtos da cesta básica para dentro do carrinho.</h2>            
          </div>          

          <div style={{ textAlign: "center",width: '38%', float:"right" }}>
          <h2> Tempo: 0{this.state.minutos}:{ this.state.segundos < 10 ? '0'+ this.state.segundos: this.state.segundos} </h2>            
          </div>

          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver, "left")}
                >
                  <table style={{ width: "100%" }}>
                    <tbody>
                      {linhas.map((itemLinha, indexLinha) => (
                        <tr>
                          {itemLinha.map((itemColuna, index) => (
                            <td id={itemColuna.id}>
                              <Draggable
                                key={itemColuna.id}
                                draggableId={itemColuna.id}
                                index={indexLinha * numeroColunas + index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    className="tooltip"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style
                                    )}
                                  >
                                    {/* {itemColuna.content} */}
                                    <span className="tooltiptext">
                                      {itemColuna.content}
                                    </span>
                                    <img src={`../imgs/${itemColuna.img}`} />
                                  </div>
                                )}
                              </Draggable>
                              {provided.placeholder}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Droppable>
            <Droppable droppableId="droppable2">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getCarrinhoListStyle(
                    snapshot.isDraggingOver,
                    "right",
                    this.state.backgroundImage
                  )}
                >
                  {/* <div style={{ textAlign: "center" }}>
                  <h2>Carrinho de Compras</h2>
                </div> */}
                  {this.state.selected.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemCarrinhoStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >                          
                          <h3>{item.content}</h3>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      }
      </div>
    );
  }
}

export default App;
