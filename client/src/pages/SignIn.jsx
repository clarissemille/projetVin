import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/SignIn.css';


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/profile_page');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };
  return (
    <div className='container'>
      <div className='banner singin-banner container flex-center'>
      <div className='singin-block'>
        {/* <h1 className=''>Connexion</h1> */}
        <form onSubmit={handleSubmit} className='singin'>
        <div className="intro">
          <h1>Espace Admin</h1>
          <p>Connecte toi à ton compte</p>
        </div>
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type='text'
            placeholder="Nom d'utilisateur"
            id='username'
            className=''
            onChange={handleChange}
          />
          <label htmlFor="password">Mot de passe</label>
          <input
            type='password'
            placeholder='Mot de passe'
            id='password'
            className=''
            onChange={handleChange}
          />
          <button disabled={loading} className=''>
            {loading ? 'Chargement...' : 'Connexion'}
          </button>
        </form>
        <div className='singup-link'>
          <Link to='/sign-up'>
            <span className=''>Créer un compte</span>
          </Link>
        </div>
        <p className='admin-error'>
          {error ? error.message || 'Une erreur s\'est produite!' : ''}
        </p>

      </div>
      </div>
    </div>
  );
}
