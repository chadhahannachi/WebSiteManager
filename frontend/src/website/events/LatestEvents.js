// import React, { useState } from 'react';
// import './LatestEvents.css';
// import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
// import EventStyleOne from './EventStyleOne';
// import EventStyleTwo from './EventStyleTwo';
// import EventStyleThree from './EventStyleThree';

// const styles = [
//   { name: 'Intro with Cards', component: EventStyleOne },
//   { name: 'Image Cards', component: EventStyleTwo },
//   { name: 'Rounded Container', component: EventStyleThree },
// ];

// const events = [
//   {
//     title: "Abshore's Participation in the Tunisian Digital Summit",
//     img: require('../../images/company.jpg'),
//     date: '22 June 2023',
//     desc: "A visual recap of Abshore's participation in TDS 2023. We connected with industry experts, exchanged innovative ideas, and explored new partnership opportunities. A big thank you to everyone who contributed to this successful event.",
//   },
//   {
//     title: 'COMESA Tunisia Business Women Days',
//     img: require('../../images/company.jpg'),
//     date: '30 September 2022',
//     desc: "We were glad to participate in the «COMESA Tunisia Business Women Days», which was an opportunity to exchange with Tunisian women leaders, our best achievements and success stories.",
//   },
//   {
//     title: 'Seminar For The Tunisian Association of Women Engineers - ATFI',
//     img: require('../../images/company.jpg'),
//     date: '27 March 2022',
//     desc: "ABSHORE organized the WOMENWAY ACADEMY event for the Tunisian Association of Women Engineers (ATFI), the theme of the training is «Increasing Sales».",
//   },
//   {
//     title: 'SFax Tech Day’2022 Datatech',
//     img: require('../../images/company.jpg'),
//     date: '26 March 2022',
//     desc: "During this day full of exchanges and debates, our Abshore Group Commercial Director gave a presentation on «Data Governance and New Challenges to Face».",
//   },
// ];

// export default function LatestEvents() {
//   const [styleIndex, setStyleIndex] = useState(0);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const EventComponent = styles[styleIndex].component;

//   return (
//     <section className="events">
//       <div className="events-header">
//         {styleIndex !== 0 && <h1>OUR LATEST EVENTS</h1>}
//         <div className="events-style-switcher">
//           <button
//             className="menu-icon"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Change Events style"
//           >
//             <PlaylistAddCheckIcon size={24} />
//           </button>
//           {menuOpen && (
//             <ul className="style-menu">
//               {styles.map((style, index) => (
//                 <li
//                   key={index}
//                   onClick={() => {
//                     setStyleIndex(index);
//                     setMenuOpen(false);
//                   }}
//                 >
//                   {style.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//       {styleIndex !== 0 && <h2>DISCOVER ALL THE NEWS AND NOVELTIES OF OUR COMPANY</h2>}
//       <EventComponent events={events} />
//     </section>
//   );
// }




import React, { useState, useEffect } from 'react';
import './LatestEvents.css';
import EventStyleOne from './EventStyleOne';
import EventStyleTwo from './EventStyleTwo';
import EventStyleThree from './EventStyleThree';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const styles = [
  { name: 'Intro with Cards', component: EventStyleOne },
  { name: 'Image Cards', component: EventStyleTwo },
  { name: 'Rounded Container', component: EventStyleThree },
];

export default function LatestEvents({ styleIndex }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEntreprise, setUserEntreprise] = useState(null);
  const EventComponent = styles[styleIndex]?.component || EventStyleOne;
  console.log('StyleIndex reçu dans LatestEvents:', styleIndex);

  // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?.sub;
    } catch (error) {
      console.error("Error decoding token:", error);
      setError("Erreur lors du décodage du token.");
      setLoading(false);
    }
  } else {
    console.error("Token is missing from localStorage.");
    setError("Token manquant. Veuillez vous connecter.");
    setLoading(false);
  }

  // Récupérer l'entreprise de l'utilisateur connecté
  const fetchUserEntreprise = async () => {
    if (!token || !userId) {
      console.error("Token or User ID is missing");
      setError("Token ou ID utilisateur manquant.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
      const user = userResponse.data;

      if (!user.entreprise) {
        console.error("User's company (entreprise) is missing");
        setError("Entreprise de l'utilisateur non trouvée.");
        setLoading(false);
        return;
      }

      setUserEntreprise(user.entreprise);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Erreur lors de la récupération des données utilisateur.");
      setLoading(false);
    }
  };

  // Récupérer les événements associés à l'entreprise de l'utilisateur connecté
  const fetchEvents = async () => {
    if (!token || !userId || !userEntreprise) {
      console.error("Token, User ID, or User Entreprise is missing");
      setError("Données manquantes pour récupérer les événements.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(
        `http://localhost:5000/contenus/Evenement/entreprise/${userEntreprise}`,
        config
      );
      // Filtrer uniquement les événements publiés et mapper les champs
      const publishedEvents = response.data
        .filter(event => event.isPublished)
        .map(event => ({
          title: event.titre,
          img: event.image || "https://via.placeholder.com/150", // Image par défaut si aucune image
          date: event.dateDebut ? new Date(event.dateDebut).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }) : 'Date non spécifiée',
          desc: event.description,
        }));
      setEvents(publishedEvents);
    } catch (error) {
      console.error("Error fetching events by entreprise:", error);
      setError("Erreur lors de la récupération des événements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchUserEntreprise();
    }
  }, []);

  useEffect(() => {
    if (userEntreprise) {
      fetchEvents();
    }
  }, [userEntreprise]);

  if (loading) {
    return <div>Chargement des événements...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <section className="events">
      <div className="events-header">
        {styleIndex !== 0 && <h1>OUR LATEST EVENTS</h1>}
      </div>
      {styleIndex !== 0 && <h2>DISCOVER ALL THE NEWS AND NOVELTIES OF OUR COMPANY</h2>}
      {events.length > 0 ? (
        <EventComponent events={events} />
      ) : (
        <p>Aucun événement publié pour le moment.</p>
      )}
    </section>
  );
}


// import React, { useState, useEffect } from 'react';
// import './LatestEvents.css';
// import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
// import EventStyleOne from './EventStyleOne';
// import EventStyleTwo from './EventStyleTwo';
// import EventStyleThree from './EventStyleThree';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// const styles = [
//   { name: 'Intro with Cards', component: EventStyleOne },
//   { name: 'Image Cards', component: EventStyleTwo },
//   { name: 'Rounded Container', component: EventStyleThree },
// ];

// export default function LatestEvents() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userEntreprise, setUserEntreprise] = useState(null);
//   const [styleIndex, setStyleIndex] = useState(0);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const EventComponent = styles[styleIndex].component;

//   // Récupération du token et décodage pour obtenir l'ID de l'utilisateur
//   const token = localStorage.getItem("token");
//   let userId = null;

//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       userId = decodedToken?.sub;
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       setError("Erreur lors du décodage du token.");
//       setLoading(false);
//     }
//   } else {
//     console.error("Token is missing from localStorage.");
//     setError("Token manquant. Veuillez vous connecter.");
//     setLoading(false);
//   }

//   // Récupérer l'entreprise de l'utilisateur connecté
//   const fetchUserEntreprise = async () => {
//     if (!token || !userId) {
//       console.error("Token or User ID is missing");
//       setError("Token ou ID utilisateur manquant.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };

//       const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, config);
//       const user = userResponse.data;

//       if (!user.entreprise) {
//         console.error("User's company (entreprise) is missing");
//         setError("Entreprise de l'utilisateur non trouvée.");
//         setLoading(false);
//         return;
//       }

//       setUserEntreprise(user.entreprise);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       setError("Erreur lors de la récupération des données utilisateur.");
//       setLoading(false);
//     }
//   };

//   // Récupérer les événements associés à l'entreprise de l'utilisateur connecté
//   const fetchEvents = async () => {
//     if (!token || !userId || !userEntreprise) {
//       console.error("Token, User ID, or User Entreprise is missing");
//       setError("Données manquantes pour récupérer les événements.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const config = {
//         headers: { Authorization: `Bearer ${token}` },
//       };
//       const response = await axios.get(
//         `http://localhost:5000/contenus/Evenement/entreprise/${userEntreprise}`,
//         config
//       );
//       // Filtrer uniquement les événements publiés et mapper les champs
//       const publishedEvents = response.data
//         .filter(event => event.isPublished)
//         .map(event => ({
//           title: event.titre,
//           img: event.image || "https://via.placeholder.com/150", // Image par défaut si aucune image
//           date: event.dateDebut ? new Date(event.dateDebut).toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'long',
//             year: 'numeric'
//           }) : 'Date non spécifiée',
//           desc: event.description,
//         }));
//       setEvents(publishedEvents);
//     } catch (error) {
//       console.error("Error fetching events by entreprise:", error);
//       setError("Erreur lors de la récupération des événements.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token && userId) {
//       fetchUserEntreprise();
//     }
//   }, []);

//   // Appeler fetchEvents une fois que userEntreprise est défini
//   useEffect(() => {
//     if (userEntreprise) {
//       fetchEvents();
//     }
//   }, [userEntreprise]);

//   if (loading) {
//     return <div>Chargement des événements...</div>;
//   }

//   if (error) {
//     return <div>Erreur : {error}</div>;
//   }

//   return (
//     <section className="events">
//       <div className="events-header">
//         {styleIndex !== 0 && <h1>OUR LATEST EVENTS</h1>}
//         <div className="events-style-switcher">
//           <button
//             className="menu-icon"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Change Events style"
//           >
//             <PlaylistAddCheckIcon size={24} />
//           </button>
//           {menuOpen && (
//             <ul className="style-menu">
//               {styles.map((style, index) => (
//                 <li
//                   key={index}
//                   onClick={() => {
//                     setStyleIndex(index);
//                     setMenuOpen(false);
//                   }}
//                 >
//                   {style.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//       {styleIndex !== 0 && <h2>DISCOVER ALL THE NEWS AND NOVELTIES OF OUR COMPANY</h2>}
//       {events.length > 0 ? (
//         <EventComponent events={events} />
//       ) : (
//         <p>Aucun événement publié pour le moment.</p>
//       )}
//     </section>
//   );
// }