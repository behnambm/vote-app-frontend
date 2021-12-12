import { useState } from 'react'


function EmailModal({email, setEmail, setShowEmailModal, setIsActive}) {
    const [code, setCode] = useState('')
    const [codeError, setCodeError] = useState({show: false, message: ''})

    const [emailSent, setEmailSent] = useState(false)
    const [emailError, setEmailError] = useState({show: false, message: ''})

    const sendVerificationCode = async () => {
        const resp = await fetch('http://localhost:8000/api/user/email/', {
            method: 'POST',
            body: JSON.stringify({email: email}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!resp.ok){
            setEmailError({show:true, message: `error code ${resp.status}`})
            setEmailSent(false)
            return;
        }
        if(resp.status === 202){
            setEmailError({show: true, message: 'please wait 120 seconds'})
            setEmailSent(false)
            return;
        }
        const data = await resp.json()

        if (data.detail.includes('please check')){
            setEmailSent(true)
            setEmailError({show:false, message: ''})
            return true
        }
        setEmailError({show: true, message: data.detail})
        setEmailSent(false)
    }

    const verifyCode = async () => {
        const resp = await fetch('http://localhost:8000/api/user/email/check/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code,
                email: email
            })
        })
        if (resp.status === 200) {
            localStorage.setItem('email', email)
            setShowEmailModal(false)
            setIsActive(true)
            localStorage.setItem('isActive', true)
            return;
        }
        if (resp.status === 401) {
            setCodeError({show:true, message: 'Code is not valid'})
            return;
        }
        if (resp.status === 400){
            const data = await resp.json()
            if (data?.email?.includes('Enter a valid email')) {
                setCodeError({show: true, message: 'provided email is not valid'})
            } else if (data?.code[0] === 'Only digits are allowed') {
                setCodeError({show: true, message: 'Only digits are allowed'})
            } else if (data?.code[0] === 'Code is only 6 digits long') {
                setCodeError({show: true, message: 'Code is only 6 digits long'})
            }
            return;
        }
        if (resp.status === 500) {
            setCodeError({show:true, message: 'server not avalilable'})
        }
    }
    return (
        <div className='bg-gray-800 bg-opacity-75 w-full h-full z-10 inset-0 fixed'>
            <div className="bg-white w-3/12 my-4 mx-auto p-4 rounded">
                <h1 className='text-xl'>Verifiy your email </h1>
                <hr />
                <div className="block text-center mt-4 ">
                    <span className="border-gray-900 pl-1 pr-1 rounded-full text-center border-2">1</span>
                </div>
                <label htmlFor="email-inp" className='block'>Email:</label>
                <input type="email" id="email-inp" className='border border-gray-300 w-full rounded p-2 mb-4' value={email} onChange={e => setEmail(e.target.value)} />
                <button className='bg-purple-400 text-white p-2 rounded-lg w-full pointer hover:bg-purple-500 mb-2' onClick={sendVerificationCode}>Send</button>
                {emailSent && (
                    <div className="message flex mb-2 text-green-600 ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <small>Please check your inbox, the code is valid for 2 minutes.</small>
                </div>
                )}

                {emailError.show && (
                <div className="message flex items-center mb-1 text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <small>{emailError.message}</small>
                </div>
                )}
                <hr />
                <div className="block text-center mt-4 ">
                    <span className="border-gray-900 pl-1 pr-1 rounded-full text-center border-2">2</span>
                </div>
                <label htmlFor="code-inp" className='mt-1 block'>Code:</label>
                <input type="text" id="code-inp" className='border border-gray-300 w-full rounded p-2 mb-4' value={code} onChange={e => setCode(e.target.value)}/>
                <button className='bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-2 rounded-lg w-full pointer hover:from-purple-600 hover:via-pink-600 hover:to-red-600 mb-6' onClick={verifyCode}>Check</button>

                {codeError.show && (
                <div className="message flex items-center text-red-600 ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <small>{codeError.message}</small>
                </div>
                )}
            </div>
        </div>
    )
}

export default EmailModal
