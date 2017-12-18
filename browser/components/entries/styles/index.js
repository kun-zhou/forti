import styled, {css} from 'styled-components'

const Abstract = styled.div`
    width: 100%;
    height: 80px;
    display: flex;
    overflow: hidden;
    padding-right: 14px;
    padding-top: 10px;
    overflow-x: hidden;
    position: relative;
    ${props => props.selected && css`
        margin-top:-1px;
        height: 81px;
        z-index: 10;
        background-color: var(--color-selected-bg-entry);
        border-top: var(--color-selected-bg-entry) 1px solid;
        border-bottom: var(--color-selected-bg-entry) 1px solid;
    `}
    ${props => props.selected && props.active && css`
        background-color: var(--color-active-bg-entry);
        border-top: var(--color-active-bg-entry) 1px solid;
        border-bottom: var(--color-active-bg-entry) 1px solid;
    `}
    ${props => props.style}
`

const AbstractIndicator = styled.div`
    min-width: 20px;
`

const AbstractMain = styled.div`
    flex-grow: 1;
    overflow: hidden;
    border-bottom: var(--color-border) 1px solid;
    ${props => props.selected && css`
        border: none;
    `}
}
`
const AbstractTitle = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    padding-bottom: 4px;
    font-size: 16px;
    font-weight: var(--font-weight-abstract-title);
}
`
const AbstractIcon = styled.span`
    margin-right: 5px;
    font-weight: regular;
`
const AbstractTagsWrapper = styled.div`
    display: flex;
    position: relative;
    padding-top: 5px;
    width: 100%;
    font-size: 12px;
    font-weight: 300;
`
const AbstractTag = styled.span`
    display: flex;
    align-items: center;
    margin-right: 5px;
    font-size: 12px;
    color: rgb(149, 140, 140);
}
`

export {
  Abstract, AbstractIndicator, AbstractMain, AbstractTitle, AbstractIcon,
      AbstractTagsWrapper, AbstractTag
}
