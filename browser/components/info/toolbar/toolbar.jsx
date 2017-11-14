import React from 'react'
import sty from './sty.cssm'

class Toolbar extends React.PureComponent {

    render() {
        var fav_icon = this.props.favorite ?
            (
                <i
                    className={sty['info-tool'] + ' mark-as-fav fas fa-lg fa-fw fa-star'}
                    style={{ color: '#ffc107' }}
                    aria-hidden='true'
                    onClick={this.props.unmarkFav}
                />
            ) :
            (
                <i
                    className={sty['info-tool'] + ' mark-as-fav far fa-lg fa-fw fa-star'}
                    aria-hidden='true'
                    onClick={this.props.markFav}
                />
            )

        return (
            <div className={sty['info-entry-display-toolbar']}>
                {fav_icon}
                <i className={sty['info-tool'] + ' far fa-lg fa-fw fa-info-circle'} aria-hidden='true'></i>
                <i className={sty['info-tool'] + ' far fa-lg fa-fw fa-share-alt'} aria-hidden='true'></i>
                <i
                    className={sty['info-tool'] + ' far fa-lg fa-fw fa-trash-alt'}
                    aria-hidden='true'
                    onClick={this.props.deleteSecret}
                />
            </div>
        )
    }
}

export default Toolbar
