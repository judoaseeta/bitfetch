import * as React from 'react';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { RootState } from '../../containers/';
import * as styles from './styles/AuthButton.scss';
import { bind } from 'classnames/bind';
const authButtonStyles = bind(styles);
const mapDispatchToProps = (state: RootState) => {
    return state.main.auth;
};
const AuthButton:React.SFC<
    ReturnType<typeof mapDispatchToProps>
> = ({ isSignIn, email}) =>(
    <div
        className={authButtonStyles('authButton',{
            signed: isSignIn
        })}
    >
        {isSignIn ? <span className={styles.userName}>{email}</span>
        : <><Link
            to={'/auth/signin'}
        >Sign In</Link>
        <Link
            to={'/auth/signup'}
        >Sign Up</Link>
        </>
        }
    </div>
);
export default connect(mapDispatchToProps)(AuthButton);