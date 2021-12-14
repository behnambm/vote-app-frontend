import {useEffect, useState} from 'react'
import EmailModal from '../components/EmailModal.js'
import Vote from '../components/Vote.js'

const getVotesData = async () => {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_VOTE_API_BASE}/api/vote/`)
  const data = await resp.json()
  return data
}

export default function Home() {
  const [data, setData] = useState(null)
  const [email, setEmail] = useState('')

  const [isActive, setIsActive] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)

  const registerVote = async (voteId, userChoice) => {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_VOTE_API_BASE}/api/vote/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'email': email,
        'user_choice': userChoice,
        'vote_id': voteId,
      })
    })
  }

  useEffect(async () => {
    setEmail(localStorage.getItem('email') || '')
    setIsActive(prevState => {
      const localState = JSON.parse(localStorage.getItem('isActive'))
      if (localState) {
        setShowEmailModal(false)
        return true
      }
      else {
        setShowEmailModal(true)
        return false
      }
    })

    setData(await getVotesData())  
  }, [])
  return (
    <div className="container mx-auto mt-6">
      {data?.map(item => {
        return <Vote {...item} key={item.id} registerVote={registerVote} />
      })}

      {showEmailModal && <EmailModal email={email} setEmail={setEmail} setShowEmailModal={setShowEmailModal} setIsActive={setIsActive} />}
    </div>
  )
}
