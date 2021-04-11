import create from "zustand";
import { combine } from "zustand/middleware";

const getTokenFromStorage = () => {
  try {
    const jwtTok = localStorage.getItem("jwtTok");
    if (jwtTok && jwtTok !== "") return jwtTok;
    return null;
  } catch {
    return null;
  }
};

const useToken =  create(
  combine({ jwtTok: getTokenFromStorage() }, (setState) => ({
    setToken: (jwtTok: string) => {
      try {
        localStorage.setItem("jwtTok", jwtTok);
      } catch {}

      setState({ jwtTok });
    },
    clearTokens: () => {
      try {
        localStorage.removeItem("jwtTok");
      } catch {}

      setState({ jwtTok: "" });
    },
  }))
);

export default useToken
