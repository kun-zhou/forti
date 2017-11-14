import React from 'react';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import Add from 'material-ui-icons/Add';
import sty from './info.cssm'


class CategoryItem extends React.Component {
    handleClick = () => {
        this.props.createSecret(this.props.category.name)
        this.props.handleRequestClose()
    }
    render() {
        return <MenuItem key={this.props.category.name} onClick={this.handleClick} classes={{ root: sty['category-menu'] }}>
            <i style={{ marginRight: '5px' }} className={['fal', 'fw', this.props.category.icon].join(' ')} />  {this.props.category.name}
        </MenuItem>
    }
}
class LongMenu extends React.Component {
    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleRequestClose = (e) => {
        this.setState({ anchorEl: null });
    };

    render() {
        const open = Boolean(this.state.anchorEl);

        return (
            <div style={{ position: 'absolute', left: '8px', bottom: '8px' }}>
                <IconButton
                    onClick={this.handleClick}
                >
                    <Add />
                </IconButton>
                <Menu
                    anchorEl={this.state.anchorEl}
                    open={open}
                    onRequestClose={this.handleRequestClose}
                >
                    {this.props.categories.map(category => (
                        <CategoryItem
                            category={category}
                            createSecret={this.props.createSecret}
                            handleRequestClose={this.props.handleRequestClose}
                        />
                    ))}
                </Menu>
            </div>
        );
    }
}

export default LongMenu;