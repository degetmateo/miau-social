import Activate from "./authentication/Activate";
import Authenticate from "./authentication/Authenticate";
import Logout from "./authentication/Logout";
import RecoverPassword from "./authentication/RecoverPassword";
import RecoverUsername from "./authentication/RecoverUsername";
import RefreshToken from "./authentication/RefreshToken";
import ResetPassword from "./authentication/ResetPassword";
import Signin from "./authentication/Signin";
import Signup from "./authentication/Signup";
import Verify from "./authentication/Verify";

export const authenticationRepository = {
    RefreshToken,
    Authenticate,
    Signin,
    Logout,
    Signup,
    Verify,
    Activate,
    RecoverPassword,
    RecoverUsername,
    ResetPassword
}