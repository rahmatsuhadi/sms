import Cookies from "js-cookie"

const tokenGetter = () => {
 return Cookies.get("token-sms");
};

const tokenSetter = (token: string) => {
  Cookies.set('token-sms', token, { expires: 7 })
  return true;
};

const tokenRemove = () =>{
  return Cookies.remove("token-sms")

}


export {tokenGetter, tokenSetter, tokenRemove}