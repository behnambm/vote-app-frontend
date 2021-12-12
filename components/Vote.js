import React from 'react'

function Vote({id, title, description, first_option, second_option, registerVote}) {
    return (
        <section className='bg-green-100 m-2 p-2'>
            <h3 className='text-lg'>{title}</h3>
            <small>{description}</small>
            <div className='flex'>
                <button className='bg-blue-200 rounded p-2 py-4 mr-1 flex-grow hover:bg-blue-300' onClick={() => registerVote(id, first_option)}>
                    {first_option}</button>
                <button className='bg-blue-200 rounded p-2 py-4 ml-1 flex-grow hover:bg-blue-300' onClick={() => registerVote(id, second_option)}>{second_option}
                
                </button>
            </div>
        </section>
    )
}

export default Vote
