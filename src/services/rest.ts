import Instance from "./url";

const getToken = () => Instance({ method: "POST", url: "/token" });

export { getToken };
