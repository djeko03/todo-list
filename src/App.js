import React, { useState } from "react";
import './app.css'


const App = () => {

  const [inputValue, setInputValue] = useState('')

  const [boards, setBoards] = useState([
    {id: 1, title: 'Бэклог', items: [{id: 1, title: 'Позвонить другу'}, {id: 2, title: 'Выгулять собаку'} ]},
    {id: 2, title: 'В работе', items: [{id: 3, title: 'Устроиться на работу'}]},
    {id: 3, title: 'Проверка', items: [{id: 4, title: 'Решить задачу'}]},
    {id: 4, title: 'Готово', items: []},
  ])

  const [currentBoard, setCurrentBoard] = useState(null)
  const [currentItem, setCurrentItem] = useState(null)



  const handleCreateTask = () => {
    if(inputValue !== '') {
      let copy = Object.assign([], boards)
      copy[0].items.push({id: Date.now(), title: inputValue})
      setBoards(copy)
      setInputValue('')
    }
  }


  function dragOverHandler(e) {
    e.preventDefault()
    if(e.target.className === 'item') {
      e.target.style.boxShadow = '0 2px 3px gray'
    }
  }

  function dragLeaveHandler(e) {
    e.target.style.boxShadow = 'none'

  }

  function dragStartHandler(e, board, item) {
    setCurrentBoard(board)
    setCurrentItem(item)
  }

  function dragEndHandler(e) {
    e.target.style.boxShadow = 'none'

  }

  function dropHandler(e, board, item) {
    e.preventDefault()
    const currentIndex = currentBoard.items.indexOf(currentItem)
    currentBoard.items.splice(currentIndex, 1)
    const dropIndex = board.items.indexOf(item)
    board.items.splice(dropIndex + 1, 0, currentItem)
    setBoards(boards.map(b => {
      if(b.id === board.id) {
        return board
      }
      if(b.id ===  currentBoard.id) {
        return currentBoard
      }

      return b
    }))
    e.target.style.boxShadow = 'none'
    e.stopPropagation()
  }

  function dropCardHandler(e, board) {
      board.items.push(currentItem)
      const currentIndex = currentBoard.items.indexOf(currentItem)
      currentBoard.items.splice(currentIndex, 1)
      setBoards(boards.map(b => {
        if(b.id === board.id) {
          return board
        }
        if(b.id ===  currentBoard.id) {
          return currentBoard
        }
  
        return b
      }))
      if(e.target.children[0].innerHTML === 'Готово') {
        e.target.children[2].style.textDecoration = 'line-through'
      }

      e.target.style.boxShadow = 'none'
  }

  return (
    <div className="container">
      <div className="content">
        <input className="input" placeholder="Название задачи" value={inputValue} onChange={e => setInputValue(e.target.value)} type='text'/>
        <button className="create" onClick={handleCreateTask}>Создать</button>
      </div>

      <div className='boards'>
        
      {boards.map(board => 
      <div 
        className='board' 
        key={board.id} 
        onDragOver={e => dragOverHandler(e)} 
        onDrop={e => dropCardHandler(e, board)}
      >
        <div className='title'>{board.title}</div>
        <span>{board.items.length}</span>
        <div className="items">

          {board.items.map(item => 
              <div 
                onDragOver={e => dragOverHandler(e)}
                onDragLeave={e => dragLeaveHandler(e)}
                onDragStart={e => dragStartHandler(e, board, item)}
                onDragEnd={e => dragEndHandler(e)}
                onDrop={e => dropHandler(e, board, item)}
                key={item.id} 
                className='item'
                draggable={true}
              >
                <div>{item.title}</div>
              </div>
            )}  
        </div>     
      </div>
      )}
      </div>

    </div>
  )
}

export default App;
