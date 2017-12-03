import styled, {css} from 'styled-components'

const Abstract = styled.div `
    width: 100%;
    height: 80px;
    display: flex;
    overflow: hidden;
    padding-right: 14px;
    padding-top: 10px;
    overflow-x: hidden;
    position: relative;
    ${props => props.selected && css `
        margin-top:-1px;
        height: 81px;
        z-index: 10;
        background-color: var(--color-selected-bg-entry);
        border-top: var(--color-selected-bg-entry) 1px solid;
        border-bottom: var(--color-selected-bg-entry) 1px solid;
    `}
    ${props => props.selected && props.active && css `
        background-color: var(--color-active-bg-entry);
        border-top: var(--color-active-bg-entry) 1px solid;
        border-bottom: var(--color-active-bg-entry) 1px solid;
    `}
    ${props => props.style}
`

const AbstractIndicator = styled.div `
    min-width: 20px;
`

const AbstractMain = styled.div `
    flex-grow: 1;
    border-bottom: var(--color-border) 1px solid;
    ${props => props.selected && css `
        border: none;
    `}
}
`
const AbstractTitle = styled.div `
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding-bottom: 4px;
    font-size: 15px;
    font-weight: var(--font-weight-abstract-title);
    margin: 0;
}
`

const AbstractIcon = styled.span `
    margin-right: 2px;
`
const AbstractTagsWrapper = styled.div `
    display: flex;
    position: relative;
    padding-top: 5px;
`
const AbstractTag = styled.div `
    margin-right: 5px;
    font-size: 12px;
    color: rgb(149, 140, 140);
}
`

export {
    Abstract,
    AbstractIndicator,
    AbstractMain,
    AbstractTitle,
    AbstractIcon,
    AbstractTagsWrapper,
    AbstractTag
}