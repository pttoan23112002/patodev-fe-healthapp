import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

class HomeFooter extends Component {

    render() {

        return (
            <div className='home-footer'>
                <p>CopyRight &copy; 2023 PatoDev. More information, please visit my facebook
                    <a target='_blank' href='https://www.facebook.com/phantoan23112002'>
                        <i className='fab fa-facebook-square' style={{ 'fontSize': '16px' }}></i>
                    </a>
                </p>
            </div >
        );
    };
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
