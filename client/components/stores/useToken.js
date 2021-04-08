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

export default create(
  combine({ jwtTok: getTokenFromStorage() }, (setState) => ({
      setToken: (jwtTok) => {
        try{
            localStorage.setItem("jwtTok", jwtTok);
        }catch{
            
        }

        setState({jwtTok})
      }
  }))
);
