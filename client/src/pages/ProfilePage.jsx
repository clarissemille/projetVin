import { Link } from 'react-router-dom';
import "../styles/ProfilePage.css"
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserDataSuccess,
  getUserDataFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
  errorReset
} from '../redux/user/userSlice';
import Calendrier from './Calendrier';
import WineTable from '../components/WineTableAdmin';
import EventTable from '../components/EventTableAdmin';
import ClientTable from '../components/ClientTableAdmin';
import AccountManagement from '../components/AccountManagementAdmin';
import profilePicture from "../assets/images/profile_picture.png";


export default function ProfilePage() {
    const [button, setButton] = useState('calendrier');
    const dispatch = useDispatch();
    const fileRef = useRef(null);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    // Convertir la date en objet Date
    const createdAtDate = new Date(currentUser.createdAt);
    // Options de formatage pour le mois
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    // Formater la date selon les options
    const formattedDate = createdAtDate.toLocaleDateString('fr-FR', options);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        dispatch(updateUserStart());
        // 1. Encapsulez la requête asynchrone dans une fonction qui renvoie une promesse
        const updateUserData = async () => {
          const res = await fetch(`/api/user/update/${currentUser._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          return await res.json();
        };
    
        const data = await updateUserData(); 
        console.log(data);
    
        if (data.success === false) {
          dispatch(updateUserFailure(data));
          return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
      } catch (error) {
        dispatch(updateUserFailure(error));
      }
    };
  
    const handleDeleteAccount = async () => {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(error));
      }
    };

    const handleSignOut = async () => {
      try {
        await fetch('/api/auth/signout');
        dispatch(signOut())
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(`/api/user/${currentUser._id}`);
          const data = await res.json();
          if (data.success === false) {
            dispatch(getUserDataFailure(data));
            return;
          }
          dispatch(getUserDataSuccess(data));
        } catch (err) {
          dispatch(getUserDataFailure(err));
        }
      };
      fetchData();
    }, []);

    return (
        <div className='profil'>
          <div className="lateralNavbar">
            <div className='level level-1'>
              <img src={profilePicture} alt="image de profil" />
              <div>{currentUser.username} | Administrateur</div>
            </div>
            <div className="level level-2">
              <a onClick={() => {setButton('calendrier')}} href="#">Mon calendrier</a> 
            </div>
            <div className="level level-3">
              <a onClick={() => {setButton('manageEvent')}} href="#">Gérer les événements</a>
              <a onClick={() => {setButton('manageWines')}} href="#">Gérer les vins</a>
            </div>
            <div className="level level-4">
              <a onClick={() => {setButton('manageClient')}} href="#">Gérer mes clients</a>
              {/* <a onClick={() => {setButton('manageEmail')}} href="#">Mes listes de diffusion</a> */}
              {/* <a href="#">Administrateur</a> */}
            </div>
            <div className="level level-5">
              <a onClick={() => {setButton('manageProfil')}} href="#">Gérer mon profil</a>
            </div>
            <Link><button onClick={handleSignOut} className=''>Se déconnecter</button></Link>
          </div>
          {button === '' && <h2>Bienvenue dans votre espace administrateur</h2>}
          {button === 'calendrier' && <Calendrier />}
          {/* {button === 'calendrier' && <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FParis&bgcolor=%23ffffff&mode=MONTH&showTz=0&showPrint=0&showCalendars=0&showTitle=0&src=YzQ4ZWZhYzBkZGRiN2IxMjMzZjRmMmNmYjQ3ZjYxYmE4OTEwODI3ZTk5NjZmYTdlYmYwZWNiY2Q1MmUwNzYwN0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23C0CA33"  width="900" height="600" frameborder="0"></iframe>} */}
          {button === 'manageWines' && <WineTable />}
          {button === 'manageEvent' && <EventTable />}
          {button === 'manageClient' && <ClientTable />}
          {button === 'manageProfil' && <AccountManagement />}

          



          {/* <div className='change-profil'>
            <p className='username'>{currentUser.username}</p> 
            <form onSubmit={handleSubmit} className='flex-column'>
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                defaultValue={currentUser.username}
                type='text'
                id='username'
                placeholder="Nom d'utilisateur"
                className=''
                onChange={handleChange}
              />
              <label htmlFor="password">Mot de passe</label>
              <input
                type='password'
                id='password'
                placeholder='Mot de passe'
                className=''
                onChange={handleChange}
              />
              <p className='rounded-lg p-3'>
                  Inscrit le : {formattedDate}
              </p>
              <button className=''>
                {loading ? 'Chargement...' : 'Mettre à jour'}
              </button>
              <p className=''>{error && 'Une erreur est survenue!'}</p>
          <div>
            <Link><button onClick={handleSignOut} className=''>Se déconnecter</button></Link>
            <Link><button onClick={handleDeleteAccount} className=''>Supprimer le compte</button></Link>
          </div>
              <p className=''>
                {updateSuccess && `Votre profil a bien été mis à jour !`}
              </p>
          </form>

          </div>
          <div className='dashboard'>
            <h1>Tableau de bord</h1>  
          </div> */}
        </div>
        
    )
}