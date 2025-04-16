import Activate from "./authentication/Activate";
import Authenticate from "./authentication/Authenticate";
import RecoverPassword from "./authentication/RecoverPassword";
import RecoverUsername from "./authentication/RecoverUsername";
import ResetPassword from "./authentication/ResetPassword";
import Signin from "./authentication/Signin";
import Signup from "./authentication/Signup";
import Verify from "./authentication/Verify";

export const authenticationRepository = {
    Authenticate,
    Signin,
    Signup,
    Verify,
    Activate,
    RecoverPassword,
    RecoverUsername,
    ResetPassword
}