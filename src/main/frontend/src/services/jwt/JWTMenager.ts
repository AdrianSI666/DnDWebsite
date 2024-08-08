import secureLocalStorage from "react-secure-storage";

const JWTMenager = () => {
    const getToken = () => secureLocalStorage.getItem("accessToken")?.toString();

    const setToken = (token: string) => {
        secureLocalStorage.setItem("accessToken", token);
        return true;
    };

    const getRefreshToken = () => secureLocalStorage.getItem("refreshToken")?.toString();

    const setRefreshToken = (token: string) => {
        secureLocalStorage.setItem("refreshToken", token)
        return true;
    }

    const getUser = () => secureLocalStorage.getItem("userId");

    const setUser = (userId: number) => {
        secureLocalStorage.setItem("userId", userId)
        return true;
    }

    const deleteTokens = () => {
        secureLocalStorage.removeItem("accessToken")
        secureLocalStorage.removeItem("refreshToken")
        secureLocalStorage.removeItem("userId")
        return true;
    };

    return {
        getToken,
        setToken,
        deleteTokens,
        getRefreshToken,
        setRefreshToken,
        setUser,
        getUser
    };
};
 
export default JWTMenager();