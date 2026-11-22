import express from 'express'
import cors from 'cors'
import * as amplitude from '@amplitude/analytics-node'

const app = express()
const port = 3001

amplitude.init('7ffb0422ef649d528909e472532d455f')

app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use(express.json())

app.post('/api/contact', (req, res) => {
  const { artworkId, artworkTitle, category, collectorEmail } = req.body

  console.log('Contact request received:', {
    artworkId,
    artworkTitle,
    collectorEmail
  })

  amplitude.track('Contact Requested', {
  artwork_id: artworkId,
  artwork_title: artworkTitle,
  category: category
}, {
  user_id: 'collector-001'
})

  res.json({
    success: true,
    message: 'Contact request received.'
  })
})

app.listen(port, () => {
  console.log(`ArtMatch server running on http://localhost:${port}`)
})