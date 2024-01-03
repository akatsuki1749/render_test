import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/persons'

export const addPerson = (newPerson, setPersons, setNewName, setNewNumber, persons) => {
  axios
    .post('http://localhost:3001/api/persons', newPerson)
    .then(response => {
      setPersons(persons.concat(response.data));
      setNewName('');
      setNewNumber('');
    })
    .catch(error => {
      console.error('Error adding person:', error);
    });
};
export const getAll = () => {
  return axios.get(baseUrl)
}
const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export const remove = (url) => {
  return axios.delete(url)
}
