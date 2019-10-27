import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bind } from 'classnames/bind';
import { faSignInAlt, faSignOutAlt, faFileSignature } from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../containers/';
import AuthButtonItem from './AuthButton/AuthButtonItem';
import FaIcon from '../../utils/component/faIcon';
import * as styles from './styles/AuthButton.scss';
import {bindActionCreators, Dispatch} from "redux";
// adapters

import { authPresenterActions } from "../../core/lib/adapters/redux/authEpics";


const authButtonStyles = bind(styles);
const mapStateToProps = (state: RootState) => {
    return state.auth;
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators({
        signOut: authPresenterActions.SIGN_OUT
    }, dispatch)
});
const AuthButton:React.FunctionComponent<
    ReturnType<typeof mapStateToProps> &  ReturnType<typeof mapDispatchToProps>
> = ({ isSignIn, email, signOut }) =>(
    <div
        className={authButtonStyles('authButton',{
            signed: isSignIn
        })}
    >
        {isSignIn
            ? <div className={styles.userName}>
                <div className={styles.namePart}>{email}</div>
                <ul className={styles.accountNav}>
                    <AuthButtonItem
                        onClick={() => signOut()}
                    >
                        <FaIcon icon={faSignOutAlt} />
                        <span>Sign Out</span>
                    </AuthButtonItem>
                </ul>
            </div>
            : <ul
                style={{
                   display: 'flex'
                }}
            ><Link
                to={'/auth/signin'}
            ><FaIcon icon={faSignInAlt} />Sign In</Link>
            <Link
                to={'/auth/signup'}
            ><FaIcon icon={faFileSignature} />Sign Up</Link>
            </ul>
        }
    </div>
);
export default connect(mapStateToProps, mapDispatchToProps)(AuthButton);