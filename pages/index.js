import {useEffect, useState} from 'react'
import EmailModal from '../components/EmailModal.js'
import Vote from '../components/Vote.js'

const getVotesData = async () => {
  const resp = await fetch('http://localhost:8000/api/vote/')
  const data = await resp.json()
  return data
}

const getEmailFromLocalStorage = () => {
  const email = localStorage.getItem('email')
  if (email) return email
  else return null
}

export default function Home() {
  const [data, setData] = useState(null)
  const [email, setEmail] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)

  // if (checkEmailActiveness(email)) {

  useEffect(async () => {
    setData(await getVotesData())  
    setEmail(getEmailFromLocalStorage())

    if (isActive === false) {
      setShowEmailModal(true)
    }
  }, [])
  return (
    <div className="container mx-auto mt-6">
      {data?.map(item => {
        return <Vote {...item} key={item.id}/>
      })}

      {showEmailModal && <EmailModal email={email} setEmail={setEmail} />}
    </div>
  )
}
