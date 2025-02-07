import { useState, useContext, useEffect } from 'react';
import Card from './card';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AppContext } from '../context';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function CreateAccount() {
  return(
    <main className="container form">
      <Card
      header="Register"
      body={<CreateAccountForm/>}
      />
    </main>
  );
}

function CreateAccountForm() {
  // App Context
  const context = useContext(AppContext);
  const { currentUser, setCurrentUser, firebaseapp } = context;
  const auth = getAuth(firebaseapp);
  // Form State
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Display success message and redirect after registration
  const navigate = useNavigate();
  useEffect(() => {
  if (currentUser) {
    setSuccessMessage(`Logged in as ${currentUser.email}`);
  }
}, [currentUser]);

function handleFormSubmit(e) {
  e.preventDefault();
  setErrorMessage('');

  // Validate the First Name and Last Name fields
  const nameRegExp = /^[A-Za-z]+$/; // Regular expression for letters only

  if (!nameRegExp.test(firstName) || !nameRegExp.test(lastName)) {
    setErrorMessage('First Name and Last Name must contain only letters.');
    setSuccessMessage('');
    return;
  }

  // Check if any of the required fields are empty
  if (!firstName || !lastName || !email || !password) {
    setErrorMessage('All fields are required.');
    setSuccessMessage('');
    return;
  }

  // Validate the password
  if (password.length < 8) {
    setErrorMessage('Password must be at least 8 characters long.');
    setSuccessMessage('');
    return;
  }

  // Use a regular expression to check for at least three alphabetic characters
  const alphabeticCount = password.replace(/[^a-zA-Z]/g, '').length;
  if (alphabeticCount < 3) {
    setErrorMessage('Password must contain at least three alphabetic characters.');
    setSuccessMessage('');
    return;
  }

  // Use a regular expression to check for at least one special character
  if (!/[!@#$%^&*()_+{}[\]:;<>,.?~\\-]/.test(password)) {
    setErrorMessage('Password must contain at least one special character.');
    setSuccessMessage('');
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const uid = userCredential.user.uid;
      axios.get(`http://localhost:3001/api/account/create/${uid}/${firstName}/${lastName}/${email}`)
        .then(function (response) {
          // handle success
          axios.get(`http://localhost:3001/api/account/${userCredential.user.uid}`)
            .then(function (response) {
              setCurrentUser(response.data);
            })
            .catch(function (error) {
              console.log(error);
            });
          setTimeout(() => {
            navigate('/');
          }, 2000);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      setErrorMessage(`Error: ${errorCode}`);
    });
}


  return (
    <>
    {successMessage ? (
      <div className="alert success">{successMessage}</div>
    ) : (
      <form>
        <input type="input" 
          className="form-control" 
          placeholder="First Name" 
          value={firstName} 
          onChange={e => setFirstName(e.currentTarget.value)} />

        <input type="input" 
          className="form-control" 
          placeholder="Last Name" 
          value={lastName} 
          onChange={e => setLastName(e.currentTarget.value)} />

        <input type="input" 
          className="form-control" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.currentTarget.value)}/>

        <input type="password" 
          className="form-control" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.currentTarget.value)}/>

        <div className="input-group flex-end">
          <button type="submit" 
            className="btn btn-dark" 
            onClick={handleFormSubmit}>Create Account</button>
        </div>
        {errorMessage && (
          <div className="alert error">
            {errorMessage}
          </div>
        )}
      </form>
    )}
    </>
  );  
}

export default CreateAccount;
