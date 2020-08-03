import React, { Component } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {PopupboxManager,PopupboxContainer} from 'react-popupbox';
import "react-popupbox/dist/react-popupbox.css"

const grid = 2;

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`,
  }));

const produtos = [
  { id: "1", content: "Feijão", ehCestaBasica: true, img:'feijao.png' },
  { id: "2", content: "Arroz", ehCestaBasica: true,img:'arroz.png' },
  { id: "3", content: "Sal", ehCestaBasica: true,img:'sal.png' },
  { id: "4", content: "Açucar", ehCestaBasica: true, img:'acucar.png' },
  { id: "5", content: "Macarrão", ehCestaBasica: true,img:'macarrao.png' },
  { id: "6", content: "Massa de Tomate", ehCestaBasica: true, img:'massaTomate.png' },
  { id: "7", content: "Óleo", ehCestaBasica: true, img:'oleo.png' },
  { id: "8", content: "Café", ehCestaBasica: true, img:'cafe.png' },
  { id: "9", content: "Fubá", ehCestaBasica: true, img:'fuba.png' },
  { id: "10", content: "Bolacha", ehCestaBasica: true, img:'bolacha.png' },
  { id: "11", content: "Bombom", ehCestaBasica: false, img:'bombom.png' },
  { id: "12", content: "Refrigerante", ehCestaBasica: false, img:'refrigerante.png' },
  { id: "13", content: "Shampoo", ehCestaBasica: false, img:'shampoo.png' },
  { id: "14", content: "Amaciante", ehCestaBasica: false, img:'amaciante.png' },
  { id: "15", content: "Danone", ehCestaBasica: false, img:'danone.png' }
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
  backgroundImage:`url(../imgs/${img})`,
  marginTop: "30px"
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

  // change background colour if dragging
  //background: isDragging ? "lightgreen" : "grey",

  //backgroundImage:'url(../imgs/carrinhoCompras.png)',
  // styles we need to apply on draggables
  ...draggableStyle,
});


const popupboxConfig = {
  titleBar: {
    enable: true,
    text: 'AVISO'
  },
  fadeIn: true,
  fadeInSpeed: 500
}

class App extends Component {
  state = {
    items: produtos,
    selected: [],
    backgroundImage: 'carrinhoCompras.png'
  };

  openPopupbox(mensagem) {
    const content = (
      <div>        
        <span className="quotes-from">{mensagem}</span>
      </div>
    )
    PopupboxManager.open({ content })
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
        this.openPopupbox("O PRODUTO " + produto.content.toUpperCase() + " NÃO PERTENCE A CESTA BÁSICA!!!");
        return;
      }      

      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      debugger;
      let img = `carrinhoCompras${this.getList(destination.droppableId).length + 1}Produto.png`;

      this.setState({
        items: result.droppable,
        selected: result.droppable2,
        backgroundImage: img
      });
    }
  };

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
        <PopupboxContainer {...popupboxConfig}/>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div style={{ textAlign: "center" }}>
            <h2>Compre Somente Produtos da Cesta Básica</h2>
          </div>

          <div style={{ textAlign: "center", width:'60%', float:"left" }}>
              <h2>Produtos do Supermercado</h2>
           </div>
           <div style={{ textAlign: "center", width:'38%', float:"right" }}>
              <h2>Meu Carrinho</h2>
           </div>

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
                              index={(indexLinha * numeroColunas) + index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  className='tooltip'
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  {/* {itemColuna.content} */}
                                  <span className="tooltiptext">{itemColuna.content}</span>
                                  <img src={`../imgs/${itemColuna.img}`}/>
                                </div>
                              )}
                            </Draggable>
                            {provided.placeholder}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* {this.state.items.map((item, index) => (
                                      <Draggable
                                          key={item.id}
                                          draggableId={item.id}
                                          index={index}>
                                          {(provided, snapshot) => (
                                              <tr
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  style={getItemStyle(
                                                      snapshot.isDragging,
                                                      provided.draggableProps.style
                                                  )}>
                                                  {item.content}
                                              </tr>
                                          )}
                                      </Draggable>
                                  ))} */}
                    {/* {provided.placeholder} */}
                  </tbody>
                </table>
              </div>
            )}
          </Droppable>
          <Droppable droppableId="droppable2">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getCarrinhoListStyle(snapshot.isDraggingOver, "right",this.state.backgroundImage)}
              >
                {/* <div style={{ textAlign: "center" }}>
                  <h2>Carrinho de Compras</h2>
                </div> */}
                {this.state.selected.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
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
                        {/* <img src={`../imgs/${item.img}`}/> */}
                        {/* <h3>{item.content}</h3> */}
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
    );
  }
}

export default App;
