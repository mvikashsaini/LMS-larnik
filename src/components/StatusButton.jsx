import React from 'react'

export default function StatusButton(
    {
        title = "active",
        colour = "yellow"
    }
) {

  return (
    <div>
        <span className="px-2 py-1 rounded-full text-sm font-bold" style={{backgroundColor: colour}}>
            {title}
        </span>
    </div>
  )
}
