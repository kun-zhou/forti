import React from 'react';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import { MenuItem, MenuList } from 'material-ui/Menu'
import Add from 'material-ui-icons/Add';
import sty from './info.cssm'


class CategoryItem extends React.PureComponent {
    handleClick = () => {
        this.props.createSecret(this.props.name)
        this.props.handleRequestClose()
    }
    render() {
        return <MenuItem key={this.props.name} onClick={this.handleClick} className={sty['category-item']}>
            <i style={{ marginRight: '5px' }} className={['fal', 'fw', this.props.icon].join(' ')} />  {this.props.name}
        </MenuItem>
    }
}

class LongMenu extends React.PureComponent {
    state = {
        open: false,
        anchorEl: null,
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget, open: true })
    }

    handleRequestClose = (e) => {
        this.setState({ anchorEl: null, open: false });
    }

    render() {
        const open = Boolean(this.state.anchorEl)
        var menu_items = []
        for (var category of this.props.categories) {
            var name = category[0]
            var icon = category[1]
            menu_items.push(<CategoryItem
                key={category}
                name={name}
                icon={icon}
                createSecret={this.props.createSecret}
                handleRequestClose={this.handleRequestClose}
            />)
        }
        return (
            <div style={{ position: 'absolute', left: '8px', bottom: '8px' }}>
                <IconButton
                    onClick={this.handleClick}
                    disableRipple={true}
                >
                    <Add />
                </IconButton>
                <Popover
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={open}
                    onRequestClose={this.handleRequestClose}
                >
                    <MenuList className={sty['categories-menu']}>
                        {menu_items}
                    </MenuList>
                </Popover>
            </div>
        );
    }
}

export default LongMenu;