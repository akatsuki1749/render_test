import {useEffect, useState} from 'react';
import axios from 'axios';
import {addPerson, getAll, remove} from './Backend';

const People = (props) => {
  let myArray = [...props.persons]
  const label = 'delete'
  
  const toggleImportance = (id) =>{
    if(window.confirm("Delete " + myArray[id].name + '?')){
      remove(`http://localhost:3001/persons/${id}`).then(response => {
        getAll().then(reply => {
          props.setPersons(reply.data)
        })
      })
      
    getAll().then(response=>{
      props.setPersons(response.data)
    })
    }
    
  }
  return (
    myArray.map((person) => {
      return (
        <div key = {person.id}>
        <li className = 'nameFilter' >
        {person.name} {person.number} <button onClick={() => toggleImportance(person.id)}>{label}</button>
        </li>
        </div>
      )
    }))
}
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='success'>
      {message}
    </div>
  )
}

const FilteredPeople = (props) => {
  let myArray = [...props.filterName]
  return (
    myArray.map((person) => {
      return (
        <div key = {myArray.indexOf(person)}>
          <p>{person.name}</p>
        </div>
      )
    })
  )
}

const PeopleForm = (props) => {
  const { persons, setPersons, newName, newNumber, setNewName, setNewNumber } = props;
  const addPeople = (event) => {
    event.preventDefault()
    const findObject = persons.find(item => item.name === newName)
    if(findObject == undefined){
      let newPerson = ({'name' :newName, 'number' :newNumber,id: persons.length+1})
      //setPersons(newPerson)
      addPerson(newPerson, setPersons, setNewName, setNewNumber, persons);
      props.setNotification(newName + ' has been added!')
      setTimeout(() => {
        props.setNotification(null)
      }, 5000)
    }
    else {
     alert(findObject.name + ' already exists') 
    }
  }
  const handleNewPerson = (event) => {
    setNewName((event.target.value))
  }
  const handleNewNumber = (event) => {
    setNewNumber((event.target.value))
  }
  return (
    <form onSubmit = {addPeople}>
        <div>
        name: <input value={newName}
          onChange={handleNewPerson}/>
        </div>
        <div>
        number: <input value={newNumber}
          onChange={handleNewNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}
const App = () => {
  const [notificationMessage, setNotificationMessage] = useState('Add a name!')
  const [persons, setPersons] = useState([])  
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/api/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'people')
  /*
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '92838174',id: 1} ,
    { name: 'Sans Miller' , number: '17492716',id: 2},
    { name: 'Louise Francoise', number: '59192847', id:3},
    { name: 'Henrietta', number: '29174728', id:4}
  ]) */
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setNewFilterName] = useState([])
  const filterPhoneBook =(event) =>{
    let tempFilterName = (event.target.value)
    setNewFilterName(persons.filter(person => person.name.toLowerCase().includes(tempFilterName.toLowerCase())))
    console.log(filterName)
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <div>
        filter shown with <input
          onChange={filterPhoneBook}/>
          <FilteredPeople filterName = {filterName}></FilteredPeople>
        </div>
      <h2>Add a new</h2>
      <PeopleForm newName = {newName} newNumber = {newNumber} setPersons = {setPersons} setNewName = {setNewName} setNewNumber = {setNewNumber} persons = {persons} setNotification = {setNotificationMessage}></PeopleForm>
      <h2>Numbers</h2>
      <People persons = {persons} setPersons = {setPersons}></People>
    </div>
  )
}

export default App