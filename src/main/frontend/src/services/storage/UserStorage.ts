import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

interface UserState {
    userId?: number,
    setUser: (userId: number) => void;
    resetUser: () => void;
}

const useUserState = create<UserState>()(
    devtools(
        persist(
            (set) => ({
                userId: undefined,
                setUser: (userId: number) => {
                    set({userId})
                },
                resetUser: () => {
                    set({userId: undefined})
                }
            }),
            {
                name: 'userStore',
                storage: createJSONStorage(() => sessionStorage),
             },
        ),
    ),
)

export default useUserState;