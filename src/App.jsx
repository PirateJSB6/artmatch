import { useState,useEffect } from 'react'
import artworks from './data/artworks'
import * as amplitude from '@amplitude/unified'

amplitude.initAll('7ffb0422ef649d528909e472532d455f', {
  sessionReplay: {
    sampleRate: 1
  }
})

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [currentScreen, setCurrentScreen] = useState('home')
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0)
  const [favorites, setFavorites] = useState([])
  const [selectedArtwork, setSelectedArtwork] = useState(null)

useEffect(() => {
  if (isLoggedIn && currentScreen === 'artmatch') {
    amplitude.track('Artwork Viewed', {
      artwork_id: artworks[currentArtworkIndex].id,
      artwork_title: artworks[currentArtworkIndex].title,
      category: artworks[currentArtworkIndex].category
    })
  }
}, [currentArtworkIndex, currentScreen, isLoggedIn])

function handleLogin() {
  if (email === 'collector@artmatch.com' && password === 'art123') {
    
    amplitude.setUserId('collector-001')

      const identify = new amplitude.Identify()
      identify.set('email', email)
      amplitude.identify(identify)

      amplitude.track('Login Completed')

    setIsLoggedIn(true)
    setLoginError('')
  } else {
    setLoginError('Invalid email or password.')
  }
}

function showNextArtwork() {
  setCurrentArtworkIndex((currentArtworkIndex + 1) % artworks.length)
}

function handleLike() {
  if (!favorites.some(favorite => favorite.id === artworks[currentArtworkIndex].id)) {
  setFavorites([...favorites, artworks[currentArtworkIndex]])
  }
  
amplitude.track('Artwork Liked', {
  artwork_id: artworks[currentArtworkIndex].id,
  artwork_title: artworks[currentArtworkIndex].title,
  category: artworks[currentArtworkIndex].category
})

  showNextArtwork()

}

function handleFavoriteSelect(artwork) {
  setSelectedArtwork(artwork)

  amplitude.track('Favorite Selected', {
    artwork_id: artwork.id,
    artwork_title: artwork.title,
    category: artwork.category
  })

  setCurrentScreen('detail')
}

function handleContactArtist(artwork) {
  amplitude.track('Contact Artist Started', {
    artwork_id: artwork.id,
    artwork_title: artwork.title,
    category: artwork.category
  })

  setCurrentScreen('contact')
}

async function handleContactConfirm() {
  const response = await fetch('http://localhost:3001/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      artworkId: selectedArtwork.id,
      artworkTitle: selectedArtwork.title,
      category: selectedArtwork.category,
      collectorEmail: email
    })
  })

  const data = await response.json()

  if (data.success) {
    setCurrentScreen('success')
  }
}

  if (!isLoggedIn) {
  return (
    <div>
      <h1>ArtMatch</h1>
      <p>Sign in to discover art you love.</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button onClick={handleLogin}>
        Sign In
      </button>
      {loginError && <p>{loginError}</p>}
    </div>
  )
}

return (
  <div>

    <header>
      <h1>ArtMatch</h1>
      <p>Welcome, Collector</p>
    </header>

    <main>
      {currentScreen === 'home' && (
        <div>
          <h2>Your Favorites</h2>

      {favorites.length === 0 ? (
        <p>You have no favorite artworks yet.</p>
) : (
      favorites.map((favorite) => (
        <button key={favorite.id} 
        onClick={() => handleFavoriteSelect(favorite)}>
          {favorite.title}
        </button>
      ))
)}

 </div>
      )}

      {currentScreen === 'artmatch' && (
        <div>
          <h2>Discover Artwork</h2>
          <p> {artworks[currentArtworkIndex].title}</p>
          <p> {artworks[currentArtworkIndex].category}</p>
          <img src={artworks[currentArtworkIndex].image} alt={artworks[currentArtworkIndex].title} />

          <button onClick={showNextArtwork}>
            Pass
          </button>

          <button onClick={handleLike}>
            Like
          </button>
        </div>
      )}

      {currentScreen === 'detail' && (
        <div>
          <h2>{selectedArtwork.title}</h2>
          <p>{selectedArtwork.category}</p>
          <img src={selectedArtwork.image} alt={selectedArtwork.title} />

          <button onClick={() => setCurrentScreen('home')}>
            Back
          </button>

          <button onClick={() => handleContactArtist(selectedArtwork)}>
            Contact Artist
          </button>
         </div>
      
      )}

      {currentScreen === 'contact' && (
        <div>
          <h2>Contact Artist</h2>

          <p>
            Are you sure you'd like to contact the artist?
            If you accept, your email and interest in the selected painting
            will be shared with the artist and they will contact you for follow up.
          </p>

          <button onClick={() => setCurrentScreen('detail')}>
            Back
          </button>

          <button onClick={handleContactConfirm}>
            Confirm
          </button>
        </div>
      )}

      {currentScreen === 'success' && (
        <div>
          <h2>Request Sent</h2>

          <p>
              Your interest has been shared with the artist. They will contact you for follow up.
          </p>

        </div>
      )}


    </main>

    <nav>
      <button onClick={() => setCurrentScreen('home')}>
        Home
      </button>

      <button onClick={() => setCurrentScreen('artmatch')}>
        ArtMatch
      </button>
    </nav>

  </div>
)
}

export default App