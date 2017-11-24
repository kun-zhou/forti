import React from 'react'
import sty from '../../sty.cssm'
import { MenuList, MenuItem } from 'material-ui/Menu';
import Popover from 'material-ui/Popover'

// Accept templates variable and a callback function with template as input
class TypeSwitcher extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            anchorEl: null,
        }
        this.types = ['text', 'code', 'link', 'note']
    }

    toggleDropdown = (e) => {
        this.setState({ open: !this.state.open, anchorEl: e.currentTarget })
        this.props.onClick()
        e.stopPropagation()
    }

    handleTypeClick = (type) => () => {
        this.props.toggleFieldType(type)
        this.setState({ open: !this.state.open, anchorEl: event.currentTarget })
    }

    render() {
        return (
            <div className={sty['field-setting']}>
                <Popover
                    style={{ borderRadius: '2px' }}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    open={this.state.open}
                    onRequestClose={this.toggleDropdown}
                    className={sty['dropdown']}
                >
                    <MenuList className={sty['dropdown']}>
                        {this.types.map((type, idx) => <MenuItem
                            key={idx}
                            className={sty['entry-wrapper']}
                            onClick={this.handleTypeClick(type)}>
                            {'To ' + type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>)}
                    </MenuList>
                </Popover>
                <button
                    className={sty['btn-add']}
                    onClick={this.toggleDropdown}
                >
                    <i className={(this.state.open ? 'fas' : 'fal') + ' fa-fw fa-cog'} />
                </button>
            </div>
        )
    }
}

export default TypeSwitcher