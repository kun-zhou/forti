/**
 * This file defines formats which transform raw text display content to formatted display content for the value fields. 
 */
import React from 'react'

export function toCode(value) {
    return <p>{Array(value.length + 1).join('#')}</p>
}

export function toLink(value) {
    return (
        <a href={value}>{value}</a>
    )
}

// needs much more work
export function toNote(value) {
    return value
}