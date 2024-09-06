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

    const getExpirationTime = () => Number(secureLocalStorage.getItem("expAt"));

    const setExpirationTime = (expiration: number) => {
        secureLocalStorage.setItem("expAt", expiration)
        return true;
    }

    const deleteTokens = () => {
        secureLocalStorage.removeItem("accessToken")
        secureLocalStorage.removeItem("refreshToken")
        secureLocalStorage.removeItem("userId")
        secureLocalStorage.removeItem("expAt")
        return true;
    };

    return {
        getToken,
        setToken,
        deleteTokens,
        getRefreshToken,
        setRefreshToken,
        getExpirationTime,
        setExpirationTime
    };
};
 
export default JWTMenager();