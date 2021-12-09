import React from 'react'

function Vote({title, description}) {
    return (
        <section className='bg-green-100 m-2 p-2'>
            <h3 className='text-lg'>{title}</h3>
            <small>{description}</small>
        </section>
    )
}

export default Vote
