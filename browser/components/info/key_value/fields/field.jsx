import React from 'react'
import sty from '../sty.cssm'
import NameField from './subfields_components/NameField.jsx'
import ContentField from './subfields_components/ContentField.jsx'

import Popover from 'material-ui/Popover'

import { clipboard } from 'electron'

/**
 * HOC for various field components
 * `edit[A-Z]*` is for local state updates, updated on each keystroke
 * `toggle[A-Z]*` update on field input status change and pushes the local data to redux store
 */
class Field extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            name_editing: false,
            content_editing: false,
            setting_shown: false,
            local_name: props.field.get('key'),
            local_content: props.field.get('value'),
            copied_open_anchor: null,
            copied_open: null
        }
        this.n_timer = null // for name
        this.c_timer = null // for content
        // edit* is for local state updates, updated on each keystroke
        // toggle* update on field input status change and pushes the local data to redux store
    }

    editLocalName = (e) => { //name, content, type
        this.setState({ local_name: e.target.value })
    }

    editLocalContent = (e) => {
        this.setState({ local_content: e.target.value })
        this.props.updateField(this.props.sec_id, this.props.field_id, 1, e.target.value)
    }

    toggleNameEdit = () => {
        if (this.state.name_editing && this.state.local_name !== this.props.field.get('key')) {
            this.props.updateField(this.props.sec_id, this.props.field_id, 'key', this.state.local_name)
        }
        this.setState({ name_editing: !this.state.name_editing })
    }

    toggleContentEdit = (e) => {
        if (this.state.content_editing && this.state.local_content !== this.props.field.get('value')) {
            this.props.updateField(this.props.sec_id, this.props.field_id, 'value', this.state.local_content)
        }
        this.setState({
            content_editing: !this.state.content_editing,
            setting_shown: !this.state.setting_shown
        })
    }

    toggleFieldType = (type) => {
        if (type !== this.props.field.get('type')) {
            this.props.updateField(this.props.sec_id, this.props.field_id, 'type', type)
        }
    }

    deleteField = () => {
        console.log(this.props.sec_id, this.props.field_id)
        this.props.deleteField(this.props.sec_id, this.props.field_id)
    }

    handleNameFieldClick = (e) => {
        var el = e.currentTarget
        e.stopPropagation()
        if (this.state.local_content === '' || this.state.local_name === '') { //if empty, invoke name edit
            this.toggleNameEdit()
        } else {
            if (this.n_timer != null) {
                clearTimeout(this.n_timer)
                this.n_timer = null
                this.toggleNameEdit()
            } else {
                this.n_timer = setTimeout(() => {
                    this.handlePaste(el)
                    this.n_timer = null
                }, 200)
            }
        }
    }

    handleContentFieldClick = (e) => {
        if (this.state.local_content === '') {
            this.toggleContentEdit()
        } else {
            if (!this.c_timer) {
                this.c_timer = setTimeout(() => { this.c_timer = null }, 200)
            } else {
                clearTimeout(this.c_timer)
                this.c_timer = null
                this.toggleContentEdit()
            }
        }
    }

    handlePaste = el => {
        clipboard.writeText(this.state.local_content)
        this.setState({ copied_open_anchor: el })
        this.setState({ copied_open: true })
        setTimeout(() => { this.setState({ copied_open: false }) }, 600)
    }

    render() {
        var passdownProps = {
            editLocalName: this.editLocalName,
            editLocalContent: this.editLocalContent,
            toggleNameEdit: this.toggleNameEdit,
            toggleContentEdit: this.toggleContentEdit,
            deleteField: this.deleteField,
            toggleFieldType: this.toggleFieldType,
            handleNameFieldClick: this.handleNameFieldClick,
            handleContentFieldClick: this.handleContentFieldClick,

            type: this.props.field.get('type')
        }
        return (
            <div className={sty['field']}>
                <div className={sty['field-name']}>
                    <Popover
                        open={this.state.copied_open}
                        anchorEl={this.state.copied_open_anchor}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                    >
                        <div style={{
                            padding: '6px 10px 6px 10px'
                        }}> copied!</div>
                    </Popover>
                    <NameField {...Object.assign({}, this.state, passdownProps) } />

                </div>
                <div className={sty['field-content']}>
                    <ContentField {...Object.assign({}, this.state, passdownProps) } />
                </div>
            </div>

        )
    }
}

export default Field
