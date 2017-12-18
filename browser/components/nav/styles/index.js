import styled, { css } from 'styled-components'

const Pane = styled.div`
    min-width: 190px;
    width: 20%;
    height: 100%;
    overflow: hidden;
    background: linear-gradient(160deg, var(--color-bg-nav-top), var(--color-bg-nav-bottom));
    color: var(--color-font-nav);
`
/*background-color: var(--color-bg-nav);*/
const TopPlaceholder = styled.div`
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    -webkit-app-region: drag;
`

const Header = styled.div`
display: flex;
margin: 12px 4px 2px 20px;

font-weight: 600;
justify-content: space-between;
`

const Button = styled.div`
    padding: 5px;
    margin: 3px 15px 3px 15px;
    ${props => props.selected && css`
        border-radius: 3px;
        background-color: var(--color-selected-nav);
        color: var(--color-selected-font-nav);
    `}
    ${props => props.active && props.selected && css`
        color: var(--color-active-font-nav)
    `}
`


export {
    Pane,
    TopPlaceholder,
    Button,
    Header
}
