/**
 * This file defines formats which transform raw text display content to formatted display content for the value fields. 
 */
import React from 'react'
import { remote } from 'electron'
export function toCode(value) {
    return <p>{Array(value.length + 1).join('#')}</p>
}

export function toLink(value) {
    return (
        <a href={value} onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            var url = e.target.innerHTML
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
            }
            remote.shell.openExternal(url)
        }}>
            {value}
        </a >
    )
}

// needs much more work
export function toNote(value) {
    return value
}