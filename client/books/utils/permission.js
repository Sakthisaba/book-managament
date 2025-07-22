import { Route } from "react-router-dom";

const ROLES={
    'ADMIN':['edit:book','delete:book','add:book'],
    'LIBRARIAN':['edit:book','add:book'],
    'GUEST':['view:book']
}
export default function hasPermission(user,action){
    let userrole = user.role.toUpperCase();
    return ROLES[userrole].includes(action);

}