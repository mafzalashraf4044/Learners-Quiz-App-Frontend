import React, {
    Component
} from 'react';

//Helpers
import PropTypes from 'prop-types';

//Third Party Components
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class ConfirmDltPopup extends Component {

    shouldComponentUpdate = (nextProps, nextState) => {
      return this.props.showDltModal !== nextProps.showDltModal;
    }

    render() {
        const actions = [
        <FlatButton
            label="Delete"
            primary={true}
            onTouchTap={this.props._dltSelected}
        />,
        <FlatButton
            label="Close"
            primary={true}
            onTouchTap={this.props._toggleDltModal}
        />,
        ];

        return (
            <Dialog
                title={'Delete ' + this.props.type}
                actions={actions}
                modal={false}
                open={this.props.showDltModal}
                onRequestClose={this.props._toggleDltModal}
            >
                Are you sure you want to delete the selected {this.props.type.toLowerCase()}?
            </Dialog>
        );
    };
}

ConfirmDltPopup.propType = {
    type            : PropTypes.string,
    showDltModal    : PropTypes.bool,
    _toggleDltModal : PropTypes.func,
    _dltSelected     : PropTypes.func,    
}