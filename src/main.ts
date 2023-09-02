import "tailwindcss/tailwind.css"
import State from "./modules/State"

// Assigning needed DOM elements to variables

const newItemForm = document.querySelector('#new-item-form') as HTMLFormElement
const newItemInput = document.querySelector('#new-item-input') as HTMLInputElement
const itemList = document.querySelector('#item-list') as HTMLUListElement
const clearListBtn = document.querySelector('#clear-list') as HTMLButtonElement

// Creating necessary states and interfaces/types

interface ListItem {
  id: number,
  item: string,
  checked: boolean,
}

const fullList = new State<ListItem[]>([])
const inputState = new State<string>('')

// helper functions

// fetch the full list of todo items from the local storage and sets its state....also creates a new storage for the app if it didnt exist before

const fetchFullList = (): ListItem[] => {
  const stringList: string | null = localStorage.getItem("To-Do List")

  if (typeof stringList === 'string') {
    const parsedList: ListItem[] = JSON.parse(stringList)
    fullList.setState(parsedList)
    return parsedList
  } 

  return createStorage()
}

// create new storage for the app

const createStorage = (): [] => {
  localStorage.setItem("To-Do List", JSON.stringify([]))
  return []
}

// create li element in the DOM for the list items

const createListElements = (listItem: ListItem): void => {
  const Li: HTMLLIElement = document.createElement('li')
  Li.classList.add('listitem', 'dark:border-[#333]', 'last:border-0', 'first:pt-0', 'last:pb-0')
  Li.id = listItem.id.toString()

  const checkBox: HTMLInputElement = document.createElement('input')
  checkBox.type = 'checkbox'
  checkBox.checked = listItem.checked
  checkBox.classList.add('checkbox', 'peer')

  const listContent: HTMLParagraphElement = document.createElement('p')
  listContent.classList.add('list-content', 'peer-checked:line-through')
  listContent.textContent = listItem.item

  const deleteBtn: HTMLButtonElement = document.createElement('button')
  deleteBtn.type = 'button'
  deleteBtn.classList.add('rounded-lg', 'text-xl')
  deleteBtn.innerHTML = `<i class="fa-solid fa-trash" style="color: #EF233C;"></i>`

  itemList.appendChild(Li)
  Li.appendChild(checkBox)
  Li.appendChild(listContent)
  Li.appendChild(deleteBtn)

  attachEventListener(Li, checkBox, deleteBtn)
}

// attach an event listener to the checkbox to update the checked status of the list item in the local storage

const attachEventListener = (li: HTMLLIElement, checkbox: HTMLInputElement, deleteBtn: HTMLButtonElement): void => {

  checkbox.addEventListener('change', () => {
    const todoList: ListItem[] = fullList.getState()

    const updatedList: ListItem[] = todoList.map(item => {
      return item.id.toString() === li.id ? {...item, checked: checkbox.checked} : item
    })

    fullList.setState(updatedList)

    logToStorage(updatedList)
  })

  deleteBtn.addEventListener('click', () => {
    const todoList: ListItem[] = fullList.getState()

    const updatedList: ListItem[] = todoList.filter(item => {
      return item.id.toString() !== li.id
    })

    fullList.setState(updatedList)

    logToStorage(fullList.getState())

    itemList.removeChild(li)
  })
}

// creates new listitem object

const createNewListItem = (item: string): ListItem => {
  const todoList: ListItem[] = fullList.getState()

  const newItemId: number = todoList.length ? todoList[todoList.length - 1].id + 1 : 1

  const newItem: ListItem = {
    id: newItemId,
    item,
    checked: false,
  }

  fullList.setState([...todoList, newItem])

  createListElements(newItem)

  logToStorage(fullList.getState())

  return newItem
}

// logs a new item to local storage

const logToStorage = (updatedList: ListItem[]): void => {
  const stringifiedList = JSON.stringify(updatedList)
  localStorage.setItem("To-Do List", stringifiedList)
}

// main app function

const initApp = (): void => {
  // Mimicking React's controlled form input
  newItemInput.addEventListener('input', () => {
    inputState.setState(newItemInput.value)
  })

  newItemInput.value = inputState.getState()

  newItemForm.addEventListener('submit', (e) => {
    e.preventDefault()

    createNewListItem(inputState.getState())
  })

  // event listener to clear the whole list

  clearListBtn.addEventListener('click', () => {
    fullList.setState([])
    logToStorage([])

    itemList.innerHTML = ''
  })

  const todoList: ListItem[] = fetchFullList()

  fullList.setState(todoList)
  
  todoList.map(item => {
    createListElements(item)
  })
}

initApp()