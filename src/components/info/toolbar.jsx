import React from 'react'
import sty from './info.cssm'

class Toolbar extends React.PureComponent {
    constructor(props) {
        super(props)
        this.unmarkFav = this.unmarkFav.bind(this)
        this.markFav = this.markFav.bind(this)
        this.deleteEntry = this.deleteEntry.bind(this)
    }

    markFav() {
        this.props.markFav(this.props.id)
    }

    unmarkFav() {
        this.props.unmarkFav(this.props.id)
    }

    deleteEntry() {
        this.props.deleteEntry(this.props.id)
    }

    render() {
        var fav_icon = this.props.favorite ?
            (
                <i
                    className={sty['info-tool'] + ' mark-as-fav fas fa-lg fa-fw fa-star'}
                    style={{ color: '#ffc107' }}
                    aria-hidden='true'
                    onClick={this.unmarkFav}
                />
            ) :
            (
                <i
                    className={sty['info-tool'] + ' mark-as-fav far fa-lg fa-fw fa-star'}
                    aria-hidden='true'
                    onClick={this.markFav}
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
                    onClick={this.deleteEntry}
                />
            </div>
        )
    }
}

export default Toolbar
